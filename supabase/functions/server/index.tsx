import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Storage bucket name
const BUCKET_NAME = 'make-f4ff8ddc-payment-proofs';

// Initialize storage bucket on startup
(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 10485760 // 10MB
      });
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('Payment proofs bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
})();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to verify user authentication
async function verifyAuth(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// Health check endpoint
app.get("/make-server-f4ff8ddc/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTH ROUTES ====================

// Sign up new user
app.post("/make-server-f4ff8ddc/signup", async (c) => {
  try {
    const { email, password, name, phone } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Create user with admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone: phone || '' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    const userProfile = {
      id: data.user.id,
      email,
      name,
      phone: phone || '',
      isAdmin: false,
      joinedAt: new Date().toISOString()
    };

    await kv.set(`user:${data.user.id}`, userProfile);
    
    // Initialize payment records for the user (12 months)
    const currentYear = new Date().getFullYear();
    for (let month = 0; month < 12; month++) {
      const paymentRecord = {
        id: `payment-${data.user.id}-${month}-${currentYear}`,
        userId: data.user.id,
        month,
        year: currentYear,
        proofs: []
      };
      await kv.set(`payment:${data.user.id}:${month}:${currentYear}`, paymentRecord);
    }

    return c.json({ success: true, user: userProfile });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// Get current user profile
app.get("/make-server-f4ff8ddc/me", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({ user: userProfile });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

// ==================== USER ROUTES ====================

// Get all users (admin only for initial implementation, can add checks later)
app.get("/make-server-f4ff8ddc/users", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const users = await kv.getByPrefix('user:');
    return c.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Update user profile
app.put("/make-server-f4ff8ddc/users/:userId", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('userId');
    const updates = await c.req.json();

    const existingUser = await kv.get(`user:${userId}`);
    if (!existingUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updatedUser = {
      ...existingUser,
      ...updates,
      id: existingUser.id, // Don't allow ID changes
    };

    await kv.set(`user:${userId}`, updatedUser);

    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// ==================== PAYMENT ROUTES ====================

// Get all payments
app.get("/make-server-f4ff8ddc/payments", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const payments = await kv.getByPrefix('payment:');
    return c.json({ payments });
  } catch (error) {
    console.error('Get payments error:', error);
    return c.json({ error: 'Failed to fetch payments' }, 500);
  }
});

// Upload payment proof (with file upload)
app.post("/make-server-f4ff8ddc/payments/upload", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const month = parseInt(formData.get('month') as string);
    const year = parseInt(formData.get('year') as string);

    if (!file || !userId || isNaN(month) || isNaN(year)) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get existing payment record
    const paymentKey = `payment:${userId}:${month}:${year}`;
    let payment = await kv.get(paymentKey);
    
    if (!payment) {
      // Create new payment record if it doesn't exist
      payment = {
        id: `payment-${userId}-${month}-${year}`,
        userId,
        month,
        year,
        proofs: []
      };
    }

    // Check if already has 2 proofs
    const proofs = payment.proofs || [];
    if (proofs.length >= 2) {
      return c.json({ error: 'Maximum 2 proofs per month allowed' }, 400);
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${year}/${month}/${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: 'File upload failed' }, 500);
    }

    // Create signed URL (valid for 1 year)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 31536000); // 1 year in seconds

    if (urlError) {
      console.error('URL generation error:', urlError);
      return c.json({ error: 'Failed to generate file URL' }, 500);
    }

    // Add proof to payment record
    const newProof = {
      id: `proof-${Date.now()}`,
      url: urlData.signedUrl,
      fileName: file.name,
      uploadedAt: new Date().toISOString()
    };

    payment.proofs = [...proofs, newProof];
    await kv.set(paymentKey, payment);

    return c.json({ success: true, payment });
  } catch (error) {
    console.error('Upload payment proof error:', error);
    return c.json({ error: 'Failed to upload payment proof' }, 500);
  }
});

// Delete payment proof
app.delete("/make-server-f4ff8ddc/payments/:userId/:month/:year/:proofId", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('userId');
    const month = parseInt(c.req.param('month'));
    const year = parseInt(c.req.param('year'));
    const proofId = c.req.param('proofId');

    const paymentKey = `payment:${userId}:${month}:${year}`;
    const payment = await kv.get(paymentKey);

    if (!payment) {
      return c.json({ error: 'Payment record not found' }, 404);
    }

    const proofs = payment.proofs || [];
    const updatedProofs = proofs.filter((p: any) => p.id !== proofId);

    payment.proofs = updatedProofs;
    await kv.set(paymentKey, payment);

    return c.json({ success: true, payment });
  } catch (error) {
    console.error('Delete proof error:', error);
    return c.json({ error: 'Failed to delete proof' }, 500);
  }
});

// ==================== INITIALIZATION ROUTE (FOR DEMO) ====================

// Initialize demo data - creates admin and all 91 members
app.post("/make-server-f4ff8ddc/init-demo-data", async (c) => {
  try {
    // Create admin user
    const adminEmail = 'admin@club.com';
    const adminPassword = 'InvestClub2026!';
    
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      user_metadata: { name: 'Admin User', phone: '+27123456789' },
      email_confirm: true
    });

    if (adminError && !adminError.message.includes('already exists')) {
      console.error('Admin creation error:', adminError);
    }

    const adminUserId = adminData?.user?.id;

    // Store admin profile
    if (adminUserId) {
      await kv.set(`user:${adminUserId}`, {
        id: adminUserId,
        email: adminEmail,
        name: 'Admin User',
        phone: '+27123456789',
        isAdmin: true,
        joinedAt: new Date().toISOString()
      });
    }

    // Member names
    const memberNames = [
      'Mduduzi Cibane', 'Kennedy Mngoma', 'Peggy Lunga', 'PHUMLANI MADUNA',
      'Xoliswa Ngqase', 'Mphela malahlela', 'Patrick Hlathi', 'NhlaNhla Gwamada',
      'Lindani Majola', 'Celiwe Nhlapho', 'Mamokete Mookeletsi', 'Lindiwe Moyo',
      'Tumelo Motsoeneng', 'Dineo Seleke', 'Nonhlanhla Constance Kgafane', 'Nomthandazo Mavuso',
      'Mzwandile Moletsane', 'Mbali Tshabalala', 'Eric Hlangwane', 'Thandazo Mavuso',
      'George Taunyane', 'Nolusindiso Kondile', 'Sindisiwe sangweni', 'Sizakele Nhlabathi',
      'Ashley Mdletshe Malefane', 'Steven moleya', 'Diketso Makhele', 'Nhlanhla Khumalo',
      'Teressa Kgatitsoe', 'Steven Moleya', 'Shika Mathspo', 'Boitumelo Khoza',
      'Nompumelelo Ngqasa', 'Paulos Mazibu', 'Lawrence Ngomane', 'Mlungisi kop Abraham',
      'Celiwe Gunguluza', 'Anele Thanjekwayo', 'Josias Mbuyane', 'Vusi madonsela',
      'Zoleka Malefane', 'Arnold Sicelo Mazibu', 'Dikeledi Mathikge', 'Thulang Chauke',
      'Siyanda fanayedwa', 'Sizakele Mhlongo', 'Ntombizethu Le Roux', 'Puleng Tubane',
      'Maureen Sepaila', 'Caroline Dokota Makhasi', 'Maurice Phungwayo', 'Mduduzi Ndlovu',
      'Dimakatso Skhosana', 'Jabulani TSHABALALA', 'Joel Moeketsi Mokoetle', 'Thokozile Khumalo',
      'Boitumelo Lesola', 'Jabulile Dhlamini', 'Buyisiwe sibiya', 'Freddy Phakathi',
      'Hamilton Hukwe', 'Ntsakisi nemadzhilili', 'Bongani Vilakazi', 'Phila Nkumane',
      'Jabulani Tshabalala', 'Busiswa Mkhwanazi', 'Pauline Tsilo', 'Mduduzi Ndlovu B',
      'Nqobile Phewa', 'Sipho Mazibuko', 'Sidwell Khahloe', 'Lindiwe Maseko',
      'Edward Molotsane', 'Smangele Matshongo', 'Maria shirindza', 'Kiki Nkosi',
      'Carl mooke', 'Tintswalo Precious Ngoveni', 'Siyabonga Simelane', 'Mesh Gwadana',
      'Kgomotso Mosounyane', 'Esther mampho Rankapole', 'Zanele Portia Ngema', 'Talia Mathye',
      'Tumelo Zwane', 'Zanele Nhlabathi', 'Esther mampho', 'Charles Tokota',
      'Sibusiso Mazibuko', 'Lunga Skweyiya', 'Thabang Makhele'
    ];

    const createdMembers = [];
    const currentYear = new Date().getFullYear();

    // Create each member
    for (let i = 0; i < memberNames.length; i++) {
      const name = memberNames[i];
      const email = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@club.com`;
      const password = 'Member2026!';
      const phone = `+2712345${(6800 + i).toString().padStart(4, '0')}`;

      try {
        const { data: memberData, error: memberError } = await supabase.auth.admin.createUser({
          email,
          password,
          user_metadata: { name, phone },
          email_confirm: true
        });

        if (memberError) {
          console.error(`Error creating ${name}:`, memberError.message);
          continue;
        }

        const userId = memberData.user.id;

        // Store member profile
        const memberProfile = {
          id: userId,
          email,
          name,
          phone,
          isAdmin: false,
          joinedAt: new Date(2026, 0, 1 + Math.floor(i / 3)).toISOString()
        };

        await kv.set(`user:${userId}`, memberProfile);
        createdMembers.push(name);

        // Create payment records (12 months) with random payments
        const monthsPaid = Math.floor(Math.random() * 13);
        const paidMonths = new Set();
        
        while (paidMonths.size < monthsPaid) {
          paidMonths.add(Math.floor(Math.random() * 12));
        }

        for (let month = 0; month < 12; month++) {
          const isPaid = paidMonths.has(month);
          const proofs = [];
          
          if (isPaid) {
            // Add 1 or 2 mock proofs
            const numProofs = Math.random() > 0.5 ? 2 : 1;
            for (let p = 0; p < numProofs; p++) {
              proofs.push({
                id: `demo-proof-${userId}-${month}-${p}`,
                url: `https://example.com/demo-proof.pdf`,
                fileName: `payment-${month + 1}-proof-${p + 1}.pdf`,
                uploadedAt: new Date(currentYear, month, Math.floor(Math.random() * 28) + 1).toISOString()
              });
            }
          }

          const paymentRecord = {
            id: `payment-${userId}-${month}-${currentYear}`,
            userId,
            month,
            year: currentYear,
            proofs
          };

          await kv.set(`payment:${userId}:${month}:${currentYear}`, paymentRecord);
        }

        // Small delay to avoid rate limiting
        if (i % 10 === 0 && i > 0) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Failed to create ${name}:`, error);
      }
    }

    return c.json({ 
      success: true, 
      message: 'Demo data initialized successfully!',
      admin: { 
        email: adminEmail, 
        password: adminPassword,
        note: 'Use these credentials to log in as admin'
      },
      members: {
        created: createdMembers.length,
        total: memberNames.length,
        defaultPassword: 'Member2026!',
        note: 'All members can log in with their email and this password'
      }
    });
  } catch (error) {
    console.error('Init demo data error:', error);
    return c.json({ error: 'Failed to initialize demo data' }, 500);
  }
});

Deno.serve(app.fetch);
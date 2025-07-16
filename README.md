# Shorty - URL Shortener

A modern, responsive URL shortener built with React, Vite, and Supabase. Transform long URLs into short, shareable links with QR codes and detailed analytics.

## ✨ Features

- **URL Shortening**: Convert long URLs into short, memorable links
- **Custom URLs**: Create personalized short links
- **QR Code Generation**: Automatic QR code creation for each shortened URL
- **Analytics Dashboard**: Track clicks, locations, and device statistics
- **User Authentication**: Secure login/signup with Supabase Auth
- **Responsive Design**: Works seamlessly on all devices
- **Real-time Tracking**: Monitor link performance with detailed stats

## 🚀 Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Backend**: Supabase (Database, Auth, Storage)
- **Charts**: Recharts for analytics visualization
- **QR Codes**: react-qrcode-logo
- **Routing**: React Router DOM

## 📱 Pages & Endpoints

### `/` - Landing Page
- Hero section with URL input
- Redirects to auth page with URL parameter
- Animated UI elements

### `/auth` - Authentication
- Login/Signup forms
- Social authentication support
- Handles `createNew` query parameter for immediate URL creation

### `/dashboard` - User Dashboard
- Overview of all created links
- Total clicks statistics
- Search and filter functionality
- Quick link creation

### `/link/:id` - Link Details
- Individual link analytics
- QR code display and download
- Copy, download, and delete actions
- Location and device statistics charts

### `/:id` - URL Redirect
- Handles short URL redirects
- Tracks click analytics (location, device, timestamp)
- Redirects to original URL

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd shorty
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database Setup**
Create these tables in Supabase:

**urls table:**
- id (uuid, primary key)
- user_id (uuid, foreign key)
- original_url (text)
- short_url (text)
- custom_url (text, nullable)
- title (text)
- qr (text)
- created_at (timestamp)

**clicks table:**
- id (uuid, primary key)
- url_id (uuid, foreign key)
- device (text)
- city (text)
- country (text)
- created_at (timestamp)

5. **Storage Setup**
Create these buckets in Supabase Storage:
- `qr` - for QR code images
- `picture` - for user profile pictures

6. **Run the application**
```bash
npm run dev
```

## 🔧 Key Components

- **Header**: Navigation with user authentication
- **LinkCard**: Individual link display with actions
- **CreateLink**: Modal for creating new short URLs
- **LocationStats**: Geographic analytics chart
- **DeviceStats**: Device type analytics chart
- **RequireAuth**: Protected route wrapper

## 📊 Analytics Features

- **Click Tracking**: Real-time click counting
- **Geographic Data**: City and country-based analytics
- **Device Detection**: Desktop/mobile/tablet tracking
- **Visual Charts**: Interactive charts for data visualization

## 🎨 UI Features

- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Modern dark UI
- **Animations**: Smooth transitions and hover effects
- **Loading States**: Spinners and progress indicators
- **Error Handling**: User-friendly error messages

## 🔒 Security

- **Authentication**: Supabase Auth integration
- **Protected Routes**: Authenticated user access only
- **Input Validation**: Yup schema validation
- **Secure Storage**: Supabase RLS policies

## 📝 Usage

1. **Create Account**: Sign up or login
2. **Shorten URL**: Enter long URL on landing page or dashboard
3. **Customize**: Add custom short URL and title
4. **Share**: Use generated short link or QR code
5. **Track**: Monitor clicks and analytics in dashboard

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).


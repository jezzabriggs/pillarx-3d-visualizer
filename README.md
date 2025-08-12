# PillarX - 3D Model Visualizer

A modern, interactive 3D model visualization website built with Next.js, Three.js, and React Three Fiber. Perfect for showcasing 3D models with an intuitive interface and real-time controls.

## ✨ Features

- **Interactive 3D Models**: Explore different geometric shapes with real-time rendering
- **Customizable View**: Adjust background colors, grid visibility, axes, and auto-rotation
- **Responsive Design**: Beautiful UI that works on all devices
- **Performance Optimized**: Built with modern web technologies for smooth 3D rendering
- **Vercel Ready**: Optimized for deployment on Vercel

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Styling**: Tailwind CSS, Framer Motion
- **Deployment**: Vercel (optimized)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pillarx-3d-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Model Selection
- Choose from different 3D models: Cube, Sphere, Torus, Icosahedron
- Each model has unique properties and materials

### Viewer Controls
- **Mouse/Touch**: Rotate, pan, and zoom the 3D scene
- **Settings Panel**: Toggle grid, axes, and auto-rotation
- **Background**: Customize the scene background color
- **Quick Actions**: Reset camera, take screenshots, fullscreen mode

### 3D Scene Features
- **Lighting**: Ambient, directional, and point lighting for realistic rendering
- **Environment**: City environment preset for enhanced lighting
- **Shadows**: Real-time shadow casting and receiving
- **Performance**: Built-in performance monitoring with Stats.js

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js and deploy

3. **Custom Domain** (Optional)
   - Add your custom domain in Vercel dashboard
   - Configure DNS settings as instructed

### Environment Variables
No environment variables are required for basic functionality.

## 🛠️ Development

### Project Structure
```
pillarx-3d-visualizer/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── Header.tsx         # Navigation header
│   ├── ControlPanel.tsx   # Settings and controls
│   └── ModelViewer.tsx    # 3D scene renderer
├── public/                 # Static assets
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── next.config.js          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

### Adding New 3D Models

1. **Extend the ModelSelector component** in `components/ModelViewer.tsx`
2. **Add model options** to the ControlPanel component
3. **Update types** as needed

### Customization

- **Colors**: Modify the color scheme in `tailwind.config.js`
- **3D Materials**: Adjust material properties in the ModelSelector
- **Lighting**: Customize lighting setup in the Scene component
- **Controls**: Modify OrbitControls parameters for different camera behavior

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **WebGL**: Requires WebGL 2.0 support

## 🔧 Troubleshooting

### Common Issues

1. **3D Scene Not Loading**
   - Check browser WebGL support
   - Ensure all dependencies are installed
   - Check browser console for errors

2. **Performance Issues**
   - Reduce model complexity
   - Disable shadows on low-end devices
   - Check device GPU capabilities

3. **Build Errors**
   - Clear `.next` folder
   - Reinstall dependencies
   - Check Node.js version (18+ recommended)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ using Next.js and Three.js 
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf|obj|mtl|fbx|dae)$/,
      type: 'asset/resource',
    });
    return config;
  },
}

module.exports = nextConfig 
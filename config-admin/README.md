# Configuration Admin Panel

A React-based admin panel for managing configuration values across different tenants using JSON Schema forms.

## Features

- View all available configuration definitions
- Edit configuration values using dynamically generated forms
- Support for different tenants
- Real-time form validation based on JSON Schema
- Responsive design with Material-UI components
- Error handling and loading states

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later) or yarn

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd config-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   The application will open automatically in your default browser at [http://localhost:3000](http://localhost:3000)

## Configuration

The application is pre-configured to work with the following API endpoints:

- `GET /definitions` - Fetch all configuration definitions
- `GET /tenant/{tenant_id}/config/{key}` - Get configuration value for a tenant
- `PUT /tenant/{tenant_id}/config/{key}` - Update configuration value for a tenant

By default, the application uses `dev3471` as the tenant ID. You can modify this in the `ConfigManagerContent` component.

## Available Scripts

- `npm start` - Start the development server
- `npm test` - Run tests
- `npm run build` - Build the application for production
- `npm run eject` - Eject from create-react-app (use with caution)

## Dependencies

- React 18
- Material-UI 5
- React JSON Schema Form
- React Query
- Axios
- TypeScript

## Project Structure

```
src/
  ├── api/                    # API client and service functions
  │   └── configApi.ts        # Configuration API service
  ├── components/             # Reusable components
  │   └── ConfigManager/      # Main configuration manager component
  │       └── ConfigManager.tsx
  ├── App.tsx                 # Main application component
  ├── index.tsx               # Application entry point
  └── index.css               # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

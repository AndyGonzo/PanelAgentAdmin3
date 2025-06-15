import React, { useState, useEffect } from 'react';
import { 
  Box, List, ListItem, ListItemText, Typography, 
  CircularProgress, Button, Paper, Divider, Alert, Snackbar, AppBar, 
  Toolbar, IconButton, Tooltip, MenuItem, FormControl, InputLabel, Select,
  ThemeProvider, createTheme
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { withTheme, IChangeEvent } from '@rjsf/core';
import { Theme as MuiTheme } from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDefinitions, fetchConfigValue, saveConfigValue, ConfigDefinition, ConfigValue } from '../../api/configApi';

// Icons
const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>
);

// Create a form component with MUI theme
const Form = withTheme(MuiTheme);

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#3f51b5',
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
        margin: 'normal',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: '10px 14px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
          color: '#1e293b',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },
  },
});

interface ConfigListProps {
  definitions: ConfigDefinition[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  isLoading: boolean;
}

const ConfigList: React.FC<ConfigListProps> = ({
  definitions,
  selectedKey,
  onSelect,
  isLoading,
}) => (
  <Box sx={{ 
    width: 300, 
    bgcolor: '#f8fafc',
    height: '100%', 
    overflow: 'auto',
    borderRight: '1px solid',
    borderColor: 'divider',
    boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
  }}>
    <Box sx={{ 
      p: 2, 
      borderBottom: '1px solid #e2e8f0',
      background: '#f8fafc',
      color: '#1e293b'
    }}>
      <Typography variant="h6" sx={{ fontWeight: 500 }}>Configurations</Typography>
    </Box>
    {isLoading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    ) : (
      <List sx={{ p: 1 }}>
        {definitions.map((def) => (
          <ListItem
            button
            key={def.key}
            selected={selectedKey === def.key}
            onClick={() => onSelect(def.key)}
            sx={{
              mb: 0.5,
              borderRadius: 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '& .MuiListItemText-secondary': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemText
              primary={def.name}
              secondary={def.description}
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
              secondaryTypographyProps={{
                variant: 'body2',
                color: 'text.secondary',
              }}
            />
          </ListItem>
        ))}
      </List>
    )}
  </Box>
);

interface ConfigFormProps {
  definition: ConfigDefinition | null;
  configValue: ConfigValue | null;
  onSave: (value: any) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
}

const ConfigForm: React.FC<ConfigFormProps> = ({
  definition,
  configValue,
  onSave,
  isLoading,
  isSaving,
}) => {
  const [formData, setFormData] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (configValue) {
      setFormData(configValue.value);
    } else if (definition) {
      setFormData({});
    }
    setIsDirty(false);
  }, [definition, configValue]);

  const handleChange = (e: IChangeEvent) => {
    setFormData(e.formData);
    setIsDirty(true);
  };

  const handleSubmit = async (data: IChangeEvent) => {
    if (isDirty && formData) {
      await onSave(formData);
      setIsDirty(false);
    }
    return false; // Prevent default form submission
  };

  if (!definition) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Select a configuration to edit</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, flex: 1, overflow: 'auto', bgcolor: 'background.default' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <div>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              {definition.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {definition.description}
            </Typography>
          </div>
          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={!isDirty || isSaving}
              sx={{ 
                ml: 2,
                minWidth: 150,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-1px)',
                }
              }}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Box>

        <Divider sx={{ my: 2 }} />

        {configValue && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: 'grey.50', 
            borderRadius: 1,
            borderLeft: '3px solid',
            borderColor: 'primary.main'
          }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {configValue.lastModified && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" fontWeight={500}>
                    Last Modified
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {new Date(configValue.lastModified).toLocaleString()}
                  </Typography>
                </Box>
              )}
              {configValue.version !== undefined && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" fontWeight={500}>
                    Version
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {configValue.version}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            border: '1px solid',
            borderColor: 'divider', 
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <Form
            schema={definition.schema}
            formData={formData || {}}
            onChange={handleChange}
            onSubmit={handleSubmit}
            validator={validator}
          >
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Save
            </Button>
          </Form>
        </Paper>
      </Paper>
    </Box>
  );
};

const TENANTS = [
  'dev',
  'selfcare',
  'dev9145',
  'dev2730',
  'dev1924',
  'dev3471',
  'dev1982',
  'dev8291',
  'dev8211'
];

const ConfigManagerContent: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<string>('dev3471');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const queryClient = useQueryClient();
  
  // Reset selected config when tenant changes
  useEffect(() => {
    setSelectedKey(null);
    queryClient.invalidateQueries({ queryKey: ['definitions'] });
  }, [selectedTenant, queryClient]);

  // Fetch definitions
  const { data: definitions = [], isLoading: isLoadingDefinitions } = useQuery<ConfigDefinition[]>({
    queryKey: ['definitions', selectedTenant],
    queryFn: () => fetchDefinitions(selectedTenant),
    onSuccess: (data) => {
      if (data.length > 0 && !selectedKey) {
        setSelectedKey(data[0].key);
      }
    }
  });

  // Fetch selected config value
  const { data: configValue, isLoading: isLoadingConfig } = useQuery<ConfigValue | null>({
    queryKey: ['config', selectedTenant, selectedKey],
    queryFn: () => selectedKey ? fetchConfigValue(selectedTenant, selectedKey) : Promise.resolve(null),
    enabled: !!selectedKey
  });

  // Save config mutation
  const saveMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) =>
      saveConfigValue(selectedTenant, key, value),
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: ['definitions'] });
      queryClient.invalidateQueries({ queryKey: ['config', key] });
      setSnackbar({ open: true, message: 'Configuration saved successfully!', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ 
        open: true, 
        message: 'Failed to save configuration. Please try again.', 
        severity: 'error' 
      });
    },
  });

  const handleSave = async (value: any) => {
    if (!selectedKey) return;
    try {
      await saveMutation.mutateAsync({ key: selectedKey, value });
      setSnackbar({
        open: true,
        message: 'Configuration saved successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save configuration',
        severity: 'error',
      });
    }
  };
  
  const handleTenantChange = (event: SelectChangeEvent<string>) => {
    setSelectedTenant(event.target.value);
  };

  const selectedDefinition = definitions.find(def => def.key === selectedKey) || null;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#f5f5f5' }}>
      {/* Left sidebar with configurations list */}
      <Box sx={{ 
        width: 300, 
        bgcolor: '#f8fafc', // Light blue-gray background
        borderRight: 1, 
        borderColor: 'divider', 
        overflow: 'auto' 
      }}>
        <ConfigList
          definitions={definitions}
          selectedKey={selectedKey}
          onSelect={setSelectedKey}
          isLoading={isLoadingDefinitions}
        />
      </Box>
      
      {/* Main content area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top app bar */}
        <AppBar 
          position="static" 
          color="default" 
          elevation={0} 
          sx={{ 
            bgcolor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
          }}
        >
          <Toolbar sx={{ minHeight: '64px' }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                color: 'text.primary',
                fontWeight: 500
              }}
            >
              Configuration Manager
            </Typography>
            
            {/* Tenant selector */}
            <FormControl 
              variant="outlined" 
              size="small" 
              sx={{ 
                minWidth: 200, 
                mr: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white'
                }
              }}
            >
              <InputLabel>Tenant</InputLabel>
              <Select
                value={selectedTenant}
                onChange={handleTenantChange}
                label="Tenant"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1.5,
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      },
                      '& .Mui-selected': {
                        bgcolor: 'action.selected',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }
                    }
                  }
                }}
              >
                {TENANTS.map((tenant) => (
                  <MenuItem key={tenant} value={tenant}>
                    {tenant}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Refresh button */}
            <Tooltip title="Refresh">
              <IconButton 
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ['definitions'] });
                  if (selectedKey) {
                    queryClient.invalidateQueries({ queryKey: ['config', selectedKey] });
                  }
                }}
                disabled={isLoadingDefinitions || isLoadingConfig}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        
        {/* Main content */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          bgcolor: '#f5f5f5',
          p: 2
        }}>
          <Paper 
            elevation={0} 
            sx={{ 
              height: '100%',
              bgcolor: 'white',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <ConfigForm
              definition={selectedDefinition}
              configValue={configValue || null}
              onSave={handleSave}
              isLoading={isLoadingConfig}
              isSaving={saveMutation.isPending}
            />
          </Paper>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ConfigManager: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <ConfigManagerContent />
    </ThemeProvider>
  </QueryClientProvider>
);

export default ConfigManager;

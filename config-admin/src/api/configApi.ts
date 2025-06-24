import axios from 'axios';

const API_BASE_URL = 'https://function.chatporter.com/function/config-store';

export interface ConfigDefinition {
  key: string;
  name: string;
  description: string;
  schema: Record<string, any>;
  title?: string;
}

export interface ConfigValue {
  value: any;
  lastModified?: string;
  version?: number;
}

export const fetchDefinitions = async (tenantId: string): Promise<ConfigDefinition[]> => {
  const response = await axios.get(`${API_BASE_URL}/definitions`, {
    headers: {
      'X-Tenant-ID': tenantId
    }
  });
  return response.data;
};

export const fetchConfigValue = async (
  tenantId: string,
  key: string
): Promise<ConfigValue | null> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/tenant/${tenantId}/config/${key}`,
      {
        headers: {
          'X-Tenant-ID': tenantId
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const saveConfigValue = async (
  tenantId: string,
  key: string,
  value: any
): Promise<ConfigValue> => {
  const response = await axios.post(
    `${API_BASE_URL}/tenant/${tenantId}/config/${key}`,
    value,
    {
      headers: {
        'X-Tenant-ID': tenantId
      }
    }
  );
  return response.data;
};

export const debugLoginResponse = (response) => {
  console.group('🔍 Login Response Debug');
  console.log('Full response:', response);
  console.log('Response type:', typeof response);
  console.log('Is array?:', Array.isArray(response));
  
  // Cek berbagai kemungkinan lokasi token
  console.group('🔑 Token locations:');
  console.log('response.token:', response.token);
  console.log('response.data?.token:', response.data?.token);
  console.log('response.accessToken:', response.accessToken);
  console.log('response.access_token:', response.access_token);
  console.groupEnd();
  
  // Cek berbagai kemungkinan lokasi user
  console.group('👤 User locations:');
  console.log('response.user:', response.user);
  console.log('response.data?.user:', response.data?.user);
  console.log('response.data:', response.data);
  console.groupEnd();
  
  // List semua keys di response
  console.group('📋 Available keys:');
  if (typeof response === 'object' && response !== null) {
    console.log('Top level keys:', Object.keys(response));
    if (response.data) {
      console.log('Data keys:', Object.keys(response.data));
    }
  }
  console.groupEnd();
  
  console.groupEnd();
};

// Fungsi untuk extract token dari berbagai format
export const extractToken = (response) => {
  if (!response) return null;
  
  // Coba berbagai kemungkinan
  return (
    response.token ||
    response.data?.token ||
    response.accessToken ||
    response.access_token ||
    response.jwt ||
    response.data?.jwt ||
    null
  );
};

// Fungsi untuk extract user dari berbagai format
export const extractUser = (response) => {
  if (!response) return null;
  
  return (
    response.user ||
    response.data?.user ||
    response.data ||
    null
  );
};
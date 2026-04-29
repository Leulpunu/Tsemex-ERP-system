const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const generateMFASecret = () => {
  return speakeasy.generateSecret({
    name: 'Tsemex ERP',
    issuer: 'Tsemex',
    length: 20
  });
};

const verifyMFAToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token
  });
};

const generateQRCode = (secret) => {
  const url = typeof secret === 'string' ? secret : secret.otpauth_url;
  return QRCode.toDataURL(url);
};

module.exports = {
  generateMFASecret,
  verifyMFAToken,
  generateQRCode
};

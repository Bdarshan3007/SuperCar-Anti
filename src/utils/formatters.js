/* ==========================================================================
   FORMATTERS UTILITY
   Standardized formatting for currency, acceleration, specs
   ========================================================================== */

export const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val);
};

export const formatNumber = (val) => {
  return new Intl.NumberFormat('en-US').format(val);
};

export const formatSpeed = (val) => {
  return `${val} KM/H`;
};

export const formatAcceleration = (val) => {
  return `${val.toFixed(1)} SEC`;
};

export const formatPower = (val) => {
  return `${val} HP`;
};

export const formatTorque = (val) => {
  return `${val} NM`;
};

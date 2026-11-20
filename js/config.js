/* Form endpoint configuration.
 * Default: PHP backend included in /api/waitlist.php.
 * To use Formspree instead, replace the value with your Formspree endpoint,
 * for example: https://formspree.io/f/xxxxxxxx
 */
window.DYWE_CONFIG = {
  formEndpoint: 'api/waitlist.php'
};

window.SECURITY_CONFIG = {
  totalLayers: 6,
  // Index (0-based) of the slab that is rendered as the "core" (top layer, non-custodial vault).
  coreIndex: 5,
  layers: [
    { name: 'Tier-1 Security Audits & On-Chain Timelocks',     short: 'Audits'   },
    { name: 'Threshold FSS & Cryptographic Slashing',          short: 'FSS'      },
    { name: 'Multi-Source Oracle Guards & Price Collars',      short: 'Oracles'  },
    { name: 'Tiered Partial Liquidations & Zero-Sum Clearing', short: 'Clearing' },
    { name: 'SAFU Insurance Waterfall & Reserve Backing',      short: 'SAFU'     },
    { name: 'Non-Custodial Vaults & Scoped Permissions',       short: 'Vaults'   }
  ]
};

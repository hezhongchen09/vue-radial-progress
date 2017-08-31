module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },

  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  rules: {
  	"no-tabs": "off",
  	"indent": [ "error", "tab" ],
  	"space-infix-ops": 0,
  	"operator-linebreak": 0,
  	"semi": 0
  }
}

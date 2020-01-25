const fs = require('fs-extra');
const concat = require('concat');

(async function build() {

    const files =[
        './dist/sps-wp-webcomponents/polyfills-es2015.js',
        './dist/sps-wp-webcomponents/main-es2015.js',
        './dist/sps-wp-webcomponents/runtime-es2015.js',
    ]

    const files2 =[
        './dist/sps-wp-webcomponents/polyfills-es5.js',
        './dist/sps-wp-webcomponents/main-es5.js',
        './dist/sps-wp-webcomponents/runtime-es5.js',
    ]

    await fs.ensureDir('elements')

    await concat(files, 'elements/wp-sps-webcomponent-gioleg-es2015.js')
    await concat(files2, 'elements/wp-sps-webcomponent-gioleg-es5.js')
    console.info('Elements created successfully!')

})()

# gridsome-plugin-imagify
>Gridsome plugin converting image paths into Image objects.

## Why?
Using local images in `<g-image>` component w/o knowing upfront what images you will use, 
or using local images as properties declared as paths in content files is, at best awkward.

Couldn't find any elegant solution that would be easy to use and easy to look at.

## Install
* yarn add @woznial/gridsome-plugin-imagify
* npm install @woznial/gridsome-plugin-imagify

## Basic usage

```js
//gridsome.config.js
module.exports = {
  plugins: [
    {
      use: '@woznial/gridsome-plugin-imagify',
        options: {
            imagifyFields: [
                {
                    contentTypes: ['PortfolioItems'], // Content types in your GraphQL to handle
                    mappings: [{
                        pathField: 'fileInfo.path', // path to property containing url to imagify
                        imageField: 'imagified' // name of new field that will be added to the type    
                    }, {
                        pathField: 'cover_image',
                        imageField: 'imagified_cover_image'
                    }]
                    
                }
            ]
        }
    }
  ]
}
```

## How?
This plugin converts given string field(s) in your model to image field(s).

Expected URI should indicate a file inside the project directory like `src/gallery/image.jpg`
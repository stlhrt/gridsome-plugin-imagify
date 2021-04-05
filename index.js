const _ = require('lodash')
const path = require('path')
const { imageType } = require('gridsome/lib/graphql/types/image')

class ImagifyPlugin {
    static defaultOptions() {
        return {
            imagifyFields: [
                {
                    contentTypes: [], // content type to process
                    pathField: null, // property containing local image path
                    imageField: null // generated property name
                }
            ]
        }
    }

    constructor(api, options) {
        const {imagifyFields} = options
        api.loadSource(actions => {
            for (const config of imagifyFields) {
                this.processConfigItem(config, actions)
            }
        })
    }

    processConfigItem(config, actions) {
        config.contentTypes
            .forEach((contentType) => this.processNode(contentType, config.pathField, config.imageField, actions))
    }

    processNode(contentTypeName, pathField, imageField, actions) {
        const resolverConfig = {}
        const fieldConfig = {}
        fieldConfig[imageField] = {
            type: imageType.type,
            async resolve(obj, args, context, info) {
                const pathValue = _.get(obj, pathField)
                const fullPath = path.resolve(context.config.context, pathValue)
                try {
                    const result = await context.assets.add(fullPath, args)
                    if (result.isUrl) {
                        return result.src
                    }

                    return {
                        type: result.type,
                        mimeType: result.mimeType,
                        src: result.src,
                        size: result.size,
                        sizes: result.sizes,
                        srcset: result.srcset,
                        dataUri: result.dataUri
                    }
                } catch (err) {
                    console.log(err)
                    return null
                }
            }
        }
        resolverConfig[contentTypeName] = fieldConfig
        actions.addSchemaResolvers(resolverConfig)
    }
}

module.exports = ImagifyPlugin

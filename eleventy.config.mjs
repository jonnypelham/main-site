import { feedPlugin } from '@11ty/eleventy-plugin-rss'; // RSS
import { DateTime } from 'luxon'; // Luxon dates
import Image from '@11ty/eleventy-img';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'; // Images

export default function (eleventyConfig) {
    // Pass 'assets' directory to 'public'
    eleventyConfig.addPassthroughCopy('src/assets/');

    // Date - Locale
    eleventyConfig.addFilter('localeDate', (dateObj) => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_SHORT);
    });

    // Date – Abbreviated
    eleventyConfig.addFilter('shortDate', (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
            'dd LLL yyyy'
        );
    });

    // Date - ISO
    eleventyConfig.addFilter('isoDate', (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
            'yyyy-MM-dd'
        );
    });

    // Run Eleventy when CSS files change
    eleventyConfig.addWatchTarget('assets/**/*.css');
    // Run Eleventy when Image files change
    eleventyConfig.addWatchTarget('assets/**/*.{svg,webp,png,jpg,jpeg,gif}');

    // CSS Minify
    eleventyConfig.addFilter('cssmin', function (code) {
        return new CleanCSS({}).minify(code).styles;
    });

    // Image optimisation
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        // Output formats for each image.
        formats: ['avif', 'webp', 'auto'],
        widths: ['auto'],
        failOnError: false,
        // Attributes assigned on <img> nodes override these values
        htmlOptions: {
            imgAttributes: {
                loading: 'lazy',
                decoding: 'async',
            },
        },
        sharpOptions: {
            animated: true,
        },
    });

    // Image Shortcodes
    eleventyConfig.addShortcode(
        'image',
        async function (src, alt, widths = [300, 600], sizes = '') {
            return Image(src, {
                widths,
                formats: ['avif', 'jpeg'],
                returnType: 'html', // new in v6.0
                htmlOptions: {
                    // new in v6.0
                    imgAttributes: {
                        alt, // required, though "" works fine
                        sizes, // required with more than one width, optional if single width output
                        loading: 'lazy', // optional
                        decoding: 'async', // optional
                    },
                },
            });
        }
    );

    /**
     * Takes a collection and returns it back in display order
     * @param {Array} collection The 11ty collection
     * @returns {Array} the sorted collection
     */
    function sortByDisplayOrder(collection) {
        return collection.sort((a, b) =>
            Number(a.data.displayOrder) > Number(b.data.displayOrder) ? 1 : -1
        );
    }

    // Returns work items, sorted as above

    eleventyConfig.addCollection('projects', (collection) => {
        return collection.getFilteredByGlob('src/projects/*.md');
    });

    eleventyConfig.addCollection('featuredProjects', (collection) => {
        return collection
            .getFilteredByGlob('src/projects/*.md')
            .filter((project) => project.data.featured === true);
    });

    // Add the RSS Feed
    eleventyConfig.addPlugin(feedPlugin, {
        type: 'rss',
        outputPath: '/feed.xml',
        collection: {
            name: 'blog', // Only select posts with 'blog' tag
            limit: 20, // 0 means no limit
        },
        metadata: {
            language: 'en',
            title: 'My very cool blog',
            subtitle: "I'm writing about stuff",
            base: 'https://example.com/',
            author: {
                name: 'Jonathan Pelham',
                email: '', // Optional
            },
        },
    });

    // Directories
    return {
        dir: {
            input: 'src',
            output: 'public',
            includes: '_includes',
        },
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
    };
}

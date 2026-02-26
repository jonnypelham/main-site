// RSS plugin
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
// Luxon dates
import { DateTime } from "luxon";

// Readable date for blog
function blogDate(input) {
  return `${new Date(input).toLocaleString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;
}

export default function (eleventyConfig) {

  // Pass 'assets' directory to 'public'
  eleventyConfig.addPassthroughCopy("src/assets/");

  // Allow dates to be filtered using the function above
  eleventyConfig.addFilter('blogDate', blogDate);

  // CSS Minify
  eleventyConfig.addFilter("cssmin", function (code) {
		return new CleanCSS({}).minify(code).styles;
	});

  // Add the RSS Feed
  eleventyConfig.addPlugin(feedPlugin, {
		type: "rss",
		outputPath: "/feed.xml",
		collection: {
			name: "blog",  // Only select posts with 'blog' tag
			limit: 20,     // 0 means no limit
		},
		metadata: {
			language: "en",
			title: "My very cool blog",
			subtitle: "I'm writing about stuff",
			base: "https://example.com/",
			author: {
				name: "Jonathan Pelham",
				email: "", // Optional
			}
		}
	});

  return {
    dir: {
      input: 'src',
      output: 'public',
      includes: '_includes',
      layouts: '_layouts'
    }
  };

};

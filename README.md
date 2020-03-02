# Sanity JSON-to-docs studio tool

This plugin aims to help you when working with large chunks of data in Sanity by not requiring that you create documents through the interface or through a custom `@sanity/client` instance in node (which means, no battling around with tokens!).

## Usage

Simply run:

`sanity install json-to-docs`

If you want to enable this plugin in development environment only (**strongly recommended**), go to your root `sanity.json` file and move `json-to-docs` from the `plugins` array into:

```
"env": {
  "development": {
    "plugins": [
      ...
      "json-to-docs"
    ]
  }
}
```

And there you go! Just access the tool from the studio menu, paste in your JSON file (can be either an array or object, but don't forget to include a `_type` property to each document) and click "Create documents" 🎉

## Possible future plans

Currently, it only does one thing: gets any JSON you throw at it and uploads the document(s) to the configured dataset in the studio. However, there are a couple of things we'd like to add to it in the future:

- **A Markdown to Portable Text converter UI**
  - I've already created something along these lines for a client, it'd be a matter of making this a general-use case tool.
  - _Reasoning_: this plugin aims to provide an easier path towards migrating from external sources to Sanity, and Markdown being a common data format in many sites it's the perfect fit to add to this objective
- **Option to create documents as drafts before publishing**
- **JSON formatting and highlighting** - not sure about this one, though, as people using this plugin are developers who have access to editors such as VS Code
- **Better error handling** - right now it doesn't tell you exactly which documents failed to be sent over the wire

Oh, the `JsonToDocs` React component is a mess, sorry about that 🙃

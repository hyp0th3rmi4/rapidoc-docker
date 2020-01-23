# RapiDoc OpenAPI Viewer Docker Image

This repository contains the definition Docker Image for [RapiDoc](https://github.com/mrin9/RapiDoc), which is an OpenAPI viewer. The documentation is exposed via a modified `nginx:1.17.6-alpine` image that cotains the production packaging of [RapiDoc](https://github.com/mrin9/RapiDoc).

## Getting Started

```
   make start
```

This command will build the RapiDoc image and start the container to expose the API on port 8080. 

Other relevant make commands:

```
   make build     # build the docker image for RapiDoc.
   make clean	  # shuts down the docker network and deletes the image for RapiDoc.
```

## Folder Content

```
   |- docker
   |  |- boot.sh              # initialisation script for the container.
   |  |- defaults.env         # default settings for the RapiDoc viewer.
   |  |- index.html.template  # template html page for the RapiDoc viewer.
   |  |- html                 # HTML assets (favicon, logo, additional javascript).
   |
   |- .dockerignore           # exclude files from docker context
   |- .gitignore              # exclude files from git
   |- Dockerfile              # docker image definition
   |- Makefile                # make instructions for this folder
   |- README.md               # this file.
```


## Configuring the Viewer

All the options that can be used to configure the RapiDoc viewer can be used to style the web application by passing environment variables to the container. The default values for these variables are stored in the `docker/defaults.env` file.

**NOTE:** the attribute `spec-file` is not supported and only `spec-url` is used as a pre-built setup.

For more details about the meaning of these attributes please see the [RapiDoc documentation](https://mrin9.github.io/RapiDoc/api.html)

### Specification Configuration

- `TMPL_RAPIDOC_API_MANIFEST_URL` (default: empty): this is the URL to the manifest file. This parameter is utilised in place of `TMPL_RAPIDOC_SPEC_URL` for serving multiple OpenAPI specifications and being able to switch among them. For more details about capability check the section _Serving Multiple OpenAPI Specifications_.
- `TMPL_RAPIDOC_LOGO_URL` (default: `./logo.png`): this is the url of the logo that is shown in the viewer. You can customise it by either replacing the `docker/html/logo.png` file or simply modifing the container to point to another file.
- `TMPL_RAPIDOC_SPEC_URL` (default: `openapi.json`): maps to `spec-url`
- `TMPL_RAPIDOC_SERVER_URL` (default: `TMPL_RAPIDOC_SERVER_URL`): maps to `server-url`
- `TMPL_RAPIDOC_DEFAULT_API_SERVER` (default: empty): maps to `default-api-server`

### UI Appearance
- `TMPL_RAPIDC_HEADING_TEXT` (default: `Platform API Documentation`): maps to `heading-text`
- `TMPL_RAPIDOC_THEME` (default: `light`): maps to `theme`
- `TMPL_RAPIDOC_BG_COLOR` (default: empty): maps to `bg-color`
- `TMPL_RAPIDOC_TEXT_COLOR` (default: empty): maps to `text-color`
- `TMPL_RAPIDOC_HEADER_COLOR` (default: empty): maps to `header-color`
- `TMPL_RAPIDOC_PRIMARY_COLOR` (default: empty): maps to `primary-color`
- `TMPL_RAPIDOC_REGULAR_FONT` (default: empty): maps to `regular-font`
- `TMPL_RAPIDOC_MONO_FONT` (default: empty): maps to `mono-font`
- `TMPL_RAPIDOC_NAV_BG_COLOR` (default: empty): maps to `nav-bg-color`
- `TMPL_RAPIDOC_NAV_TEXT_COLOR` (default: empty): maps to `nav-text-color`
- `TMPL_RAPIDOC_NAV_HOVER_TEXT_COLOR` (default: empty): maps to `nav-hover-text-color`
- `TMPL_RAPIDOC_NAV_HOVER_BG_COLOR` (default: empty): maps to `nav-hover-bg-color`
- `TMPL_RAPICOD_NAV_ACCENT_COLOR` (default: empty): maps to `nav-accent-color`

### Layout
- `TMPL_RAPIDOC_LAYOUT` (default: `row`): maps to `layout`
- `TMPL_RAPIDOC_SORT_TAGS` (default: `false`): maps to `sort-tags`
- `TMPL_RAPIDOC_GOTO_PATH` (default: empty): maps to `goto-path`
- `TMPL_RAPIDOC_RENDER_STYLE` (default: `read`): maps to `render-style`
- `TMPL_RAPIDOC_API_LIST_STYLE` (default: `group-by-tag`): maps to `api-list-style`
- `TMPL_RAPIDOC_SCHEMA_STYLE` (default: `tree`): maps to `schema-style`
- `TMPL_RAPIDOC_SCHEMA_EXPAND_LEVEL` (default: `999`): maps to `schema-expand-level`
- `TMPL_RAPIDOC_SCHEMA_DESCRIPTION_EXPANDED` (default: `true`): maps to `schema-description-expanded`
- `TMPL_RAPIDOC_DEFAULT_SCHEMA_TAB=` (default: `model`): maps to `default-schema-tab`
- `TMPL_RAPIDOC_SHOW_HEADER` (default: `true`): maps to `show-header`
- `TMPL_RAPIDOC_SHOW_INFO` (default: `true`): maps to `show-info`

### Functionalities Switches
- `TMPL_RAPIDOC_ALLOW_AUTHENTICATION` (default: `true`): maps to `allow-authentication`
- `TMPL_RAPIDOC_ALLOW_SEARCH` (default: `true`): maps to `allow-search`
- `TMPL_RAPIDOC_ALLOW_TRY` (default: `false`): maps to `allow-try`
- `TMPL_RAPIDOC_ALLOW_API_LIST_STYLE_SELECTION` (default: `true`): maps to `allow-api-list-style-selection`
- `TMPL_RAPIDOC_ALLOW_SERVER_SELECTION` (default: `false`): maps to `allow-server-selection`
- `TMPL_RAPIDOC_ALLOW_SPEC_URL_LOAD` (default: `false`): maps to `allow-spec-url-load`
- `TMPL_RAPIDOC_ALLOW_SPEC_FILE_LOAD` (default: `false`): maps to `allow-spec-file-load`

### API Key Settings
- `TMPL_RAPIDOC_API_KEY_NAME` (default: `Authorization`): maps to `api-key-name`
- `TMPL_RAPIDOC_API_KEY_LOCATION` (default: `header`): maps to `api-key-location`
- `TMPL_RAPIDOC_API_KEY_VALUE` (default: empty): maps to `api-key-value`


## Modifying the Template

The basis structure of the viewer is modelled upon `docker/index.html.template`. You can alter and modify this HTML template document to further customise the appearance of the API documentation. 

## Serving Multiple OpenAPI Specifications

The default template for RapiDoc has been modified to support the capability of serving multiple OpenAPI specification which are pre-configured with the server. This is done by specifing the value of `TMPL_RAPIDOC_API_MANIFEST_URL` to point to a JSON file containing the catalog of API specification available. Here is an example of the manifest file:

```json
   {
      "default" : "./specs/openapi.json",
      "specs" : [{
         "title" : "First Spec",
         "url" : "./specs/first-openapi.json",
         "description" : "First OpenAPI Specification"
      },{
         "title" : "Second Spec",
         "url" : "./specs/second-openapi.json",
         "description" : "Second OpenAPI Specification"
      },{
         "title" : "OpenAPI Spec",
         "url" : "./specs/openapi.json",
         "description" : "Default OpenAPI Specification"
      }] 
   }
```
This particular file instructs the viewer to create a selective menu in the application (the current template places button in the left corner of the application bar) and to configure the viewer to visualise the default option `./specs/openapi.json`.  If the manifest URL is omitted the default behaviour falls back to showin the pre-configured API specification identified with the `TMPL_RAPIDOC_SPEC_URL` environment variable.

In order to modify how the menu is created and looks and feel it is sufficient to alter two files:
- `docker/index.html.template`: for the styling and the basic structure of the menu.
- `docker/htmls/api-selector.js`: for modifying the logic associated to the initial loading and selection of the OpenAPI specification.

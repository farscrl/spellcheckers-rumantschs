# Spellcheckers rumantschs

This repository provides Hunspell spellcheckers for the idioms of the Rumantsch language, as well as scripts to generate packages for distribution in different formats and for different platforms.
## Hunspell files

The Hunspell files are derived from the Pledari Grond and stored in the `dictionaries` folder, organized by idiom:
- `dictionaries/puter` 
- `dictionaries/rumgr`
- `dictionaries/surmiran`
- `dictionaries/sutsilv`
- `dictionaries/vallader`.

For each idiom, the following files are generated:
- `rm-<idiom>.dic`: The Hunspell dictionary file.
- `rm-<idiom>.aff`: The Hunspell affix file.
- `rm-<idiom>_LICENSE.txt`: Licensing information for the dictionary.
- `rm-<idiom>_version.txt`: The version number of the dictionary.

## Building the packages

### Prerequisites

Before building the packages, ensure that all dependencies are installed by running:

```bash
npm install
```

### Building for Each Idiom


To build a package for a specific idiom, pull the latest changes from the `main` branch and use one of the following commands:

   - **Puter**: `npm run pack-puter` 
   - **Rumantsch Grischun**: `npm run pack-rumgr` 
   - **Surmiran**: `npm run pack-surmiran` 
   - **Sutsilvan**: `npm run pack-sutsilv` 
   - **Vallader**: `npm run pack-vallader` 

### Output

After building, the following package files are generated:
- **Firefox & Thunderbird Add-on**: `build/<idiom>/firefox_<idiom>_<version>.xpi`
- **LibreOffice Add-on**: `build/<idiom>/libreoffice_<idiom>_<version>.oxt`

## Branches

- **`main` branch**: Contains the latest stable version of the spellcheckers.
- **`test` & `dev` branches**: Contain changes from testing environments. These branches may have incomplete or invalid data and should not be used for production setups.

const { camel, param } = require('change-case');
const { writeFile } = require('fs');


const config = `
backend:
  name: github
  repo: schalkventer/pocket-reporter
media_folder: static/assets
public_folder: assets
editor:
   preview: false
`


const languages = [
  'English',
  'Afrikaans',
  'Spanish',
  'Xhosa',
  'Northern Sotho',
  'Portuguese',
  'Southern Sotho',
  'Tswana',
  'Zulu',
]


const createTitle = language => `
          -
            name: title
            label: Title
            widget: string
            required: ${language === 'English' ? 'true' : 'false'}
`

const createRelation = type => language => `
          -
            name: ${camel(type)}
            label: ${camel(type)} Title
            widget: string
            required: ${language === 'English' ? 'true' : 'false'}
`


const createRefs = type => language => `
      - 
        name: ${language}
        label: ${language}
        widget: object
        fields:
${createTitle(language)}
${createRelation(type)(language)}
`;


const createQuestionsRefs = createRefs('Questions');
const createResourcesRefs = createRefs('Resource');


const createResource = language => `
  -
    name: ${camel(language)}Resources
    label: ${language} Resources
    folder: src/data/resources/${param(language)}/
    create: true
    fields:
        - 
          name: title
          label: Title
          widget: string
        -
          name: type
          label: Type
          widget: hidden
          default: Resources
        -
          name: language
          label: language
          widget: hidden
          default: ${language}        
        - 
          name: Content
          label: Questions
          widget: markdown
`


const createQuestions = language => `
  -
    name: ${camel(language)}Questions
    label: ${language} Questions
    folder: src/data/questions/${param(language)}/
    create: true
    fields:
      - 
        name: title
        label: Title
        widget: string
      -
        name: type
        label: Type
        widget: hidden
        default: Questions
      -
        name: language
        label: language
        widget: hidden
        default: ${language}      
      - 
        name: Questions
        label: Questions
        widget: list
        fields:
          -
            name: question
            label: Question
            widget: string
          -
            name: description
            label: Description
            widget: markdown
            required: false
          -
            name: formatOfAnswer
            label: Format of answer
            widget: select
            options:
              - Single line of text
              - Multiple lines of text
              - True or False
              - One from pre-selected options
              - Several from pre-selected options
          -
            name: options
            label: Options
            widget: list
            required: false
            fields:
              -
                name: option
                label: option
                widget: string
`;


const questionsRef = languages.map(createQuestionsRefs).join('');
const resourcesRef = languages.map(createResourcesRefs).join('');

const buildContent = (language) => `
${createQuestions(language)}
${createResource(language)}
`
const content = languages.map(buildContent).join('')


const file = `
${config}
collections:
  - 
    name: foldersPagesCollection
    label: Folders Pages
    folder: src/data/pages/folders/
    create: true
    fields:
      -
        name: title
        label: Title
        widget: string
      -
        name: type
        label: Type
        widget: hidden
        default: Pages
      -
        name: page
        label: Page
        widget: hidden
        default: Folders      
      -
        name: storyPages
        label: Story Pages
        widget: list
        required: false
        field:
          name: storyPage
          label: Story Page Title
          widget: string
      -
        name: resourcesPages
        label: Resources Pages
        widget: list
        required: false
        field:
          name: resourcesPage
          label: Resources Title Page
          widget: string
  -
    name: questionsPagesCollection
    label: Questions Pages
    folder: src/data/pages/questions/
    create: true
    fields:
      -
        name: type
        label: Type
        widget: hidden
        default: Pages
      -
        name: page
        label: Page
        widget: hidden
        default: Questions 
${questionsRef}
  -
    name: resourcesPagesCollection
    label: Resources Pages
    folder: src/data/pages/resources/
    create: true
    fields:
      -
        name: type
        label: Type
        widget: hidden
        default: Pages
      -
        name: page
        label: Page
        widget: hidden
        default: Resources 
${resourcesRef}
${content}
`;


const createFile = (err) => {
  if (err) {
    return new Error (err);
  }

  console.log('New "config.yml" file created.');
  return true;
}


writeFile('./static/admin/config.yml', file, createFile);


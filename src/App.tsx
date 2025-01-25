import * as React from 'react';

type StoryType =  { // type for storing "stories"
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: string;
};
type CallbackFunc = (event : React.ChangeEvent<HTMLInputElement>) => void; // lambda type for onSearch

// hooks should always start with 'use'
const useStorageState = (key : string, initialState : string) : [string, React.Dispatch<React.SetStateAction<string>>] => { // custom react hook that acts like useState but links with storage
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
}

/*
npm run dev
"bridge" that makes "auto-refresh" possible is react Fast Refresh on React's side and Hot Module Replacement on dev server side
jsx enables combining of markup (HTML) and logic (JS): map allows mapping from js array to html

function Blah() {return ...} vs const Blah = () => {return ...} or const Blah = () => (...): lambda function
both are fine to use: just make sure to do either consistently :)
* although implicit return statemeent might introduce tedious refactorings???
*/

type SearchProps = {id : string, value : any, type : string, onInputChange : CallbackFunc, isFocused : boolean, children : any}; // value = same type as in "type"
function InputWithLabel({ id, value, type, onInputChange, isFocused, children} : SearchProps) {
  // children = anything passed between the react compoonent (behaves like native html)
  // "props destructuring via object destructing" (works in js too!) const {searchTerm, onSearch} = props;

  // Imparitive React Implementation: used whenever ya use imparative (dom or library)
  // useRef: persistent object that lasts over lifetime of react component, can be read and changed via .current (vs. useState: not rerendered on change)
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { // performs focus on the element when component renders or isFocused changes via useEffect
    if (isFocused && inputRef.current) {
      // cause inputRef is passed to element's ref attribute, current property gives access to the element itself
      inputRef.current.focus();
    }
  }, [isFocused]);

  return(
    <React.Fragment> {/*Same as <>: packager for elements, w/out introducing useless div*/}
      <label htmlFor={id}>{children}</label>
      &nbsp; {/*makes sure label and search always go together */}
      <input
        ref={inputRef} // ref given to JSX reserved "ref" property, thus element instance
        id={id}
        name={id}
        type={type}
        value = {value}
        onChange={onInputChange}
        autoFocus={isFocused}
      >
      </input> {/*remember, pass function to values; not return value of function! value parameter forces sync with react state instead of letting component maintain its own independent state: controlled component*/}

      <p>Searching for <strong>{value}</strong></p>
    </React.Fragment>
  );
}

type ItemProps = {item : StoryType, index : number};
/*
Nested destructuring works too!
type ItemProps = {{title, url, author, num_comments, points, objectID} : StoryType, index : number};

Or "spread and rest" operators: pass every property of item directly to the Item component
type ItemProps = {title : string, url : string, author : string, num_comments : number, points : number, objectID : string}

Can be improved using "spread operator": automatically passes object's key-value pairs as attribute-values pairs to JSX element
... <Item key = {item.objectID} {...item}> (From list component)

Similar to "rest operator", last part of object destructuring
type ItemProps = {{num_comments : number, points : number, objectID : number, ...authorData : {title : string, url : string, author : string}}};

rest at left side of an assignment, spread occurs on right of assignment
*/
function Item({item, index} : ItemProps) {
  // console.log("Item component rendered!")
  return (
    <li key = {item.objectID}>
      <span>
        <a href = {item.url}>{item.title} </a>
      </span>
      <span>{item.author} </span>
      <span>{item.num_comments} </span>
      <span>{item.points} </span>
      <span>{index}</span> {/*index of item in list!*/}
    </li>
  );
}

/*
child component of app, leaf component (doesn't render any other components)
component similar idea to 'class' in other
we use components as elements anywhere else, generate instances of List
*/
type ListProps = { list: StoryType[], filterKey : string};
function List({list, filterKey} : ListProps) { // props: everything we pass down from parent to child, cannot be modified (const)
  // console.log("List component rendered!")
  var searchedList : StoryType[] = list.filter((item : StoryType) => (item.title.toLowerCase().includes(filterKey.toLowerCase()))); // new list, filters by if the title contains the filterKey as a substring
  return (
  <ul>
    {/*each DIRECT decendant of ul needs key: even component!*/}
    {searchedList.map((item : StoryType , index : number) => (
      <Item key={item.title} item = {item} index = {index} />
      ))}
  </ul>
  );
}

// entry point or root component; root of component tree
function App() {
  /*
  console.log("App component rendered!")

  React component (App Component specifically) is just a js function, CamelCase + staring capital (determined by function starting with Capital)
  specifically function component, most common although other types
  function compoent runs every time the component is displayed in the browser: for the initial rendering and any subsequent re-renders

  htmlFor reflects attribute in vanilla html, due to impementation detauls of React
  TSX closer to js than html, so uses camelCase

  points = popularity
  don't fit standard js naming conventions
  key attribute used for efficent rerender: when have to rerender, checks whether item has changed; can efficently exchanged changed item w/ key identifier
  */


  const stories : StoryType[] = [
    {
      title : 'React',
      url : 'https://reactjs.org/',
      author : 'Jordan Walke',
      num_comments : 3,
      points : 4,
      objectID : "0",
    },
    {
      title : 'Redux',
      url : 'https://redus.js.org/',
      author : 'Dan Abramov, Andrew Clark',
      num_comments : 2,
      points : 5,
      objectID : "1",
    },
    {
      title: 'Vue.js',
      url: 'https://vuejs.org/',
      author: 'Evan You',
      num_comments: 8,
      points: 7,
      objectID: "2",
    },
    {
      title: 'Angular',
      url: 'https://angular.io/',
      author: 'Google',
      num_comments: 6,
      points: 6,
      objectID: "3",
    },
    {
      title: 'Svelte',
      url: 'https://svelte.dev/',
      author: 'Rich Harris',
      num_comments: 10,
      points: 9,
      objectID: "4",
    },
    {
      title: 'Node.js',
      url: 'https://nodejs.org/',
      author: 'Ryan Dahl',
      num_comments: 15,
      points: 10,
      objectID: "5",
    },
    {
      title: 'Deno',
      url: 'https://deno.land/',
      author: 'Ryan Dahl',
      num_comments: 5,
      points: 8,
      objectID: "6",
    },
    {
      title: 'Next.js',
      url: 'https://nextjs.org/',
      author: 'Vercel',
      num_comments: 12,
      points: 11,
      objectID: "7",
    },
    {
      title: 'Gatsby',
      url: 'https://gatsbyjs.com/',
      author: 'Kyle Mathews',
      num_comments: 4,
      points: 5,
      objectID: "8",
    },
    {
      title: 'Bootstrap',
      url: 'https://getbootstrap.com/',
      author: 'Twitter',
      num_comments: 20,
      points: 15,
      objectID: "9",
    },
    {
      title: 'Tailwind CSS',
      url: 'https://tailwindcss.com/',
      author: 'Adam Wathan',
      num_comments: 18,
      points: 14,
      objectID: "10",
    },
    {
      title: 'Electron',
      url: 'https://electronjs.org/',
      author: 'GitHub',
      num_comments: 7,
      points: 6,
      objectID: "11",
    },
  ];

  /*
  [current_state, function to change state], like read n write
  useState is "React Hook": state can be anything from string to complex datastructure
  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem('search') || ''
  ); "stateful value": may change over time. when changed, causes rerender of children up to parent where stateful value is defined
  */
  
  const [searchTerm, setSearchTerm] = useStorageState('search', ''); // custom React hook! see "useStorageState"

  /*
  "useEffect" hook: first arg is function that runs side effect, second arg is "dependency list"
  when variable in "dependency list" changes, calls "side effect function" (or when variable is initalized for first time)
  empty depedency list = runs on every render
  React.useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm]);
  */

  // callback handler: event handler that allows "communication" between parent and child components (pass as prop to child, lifting state)
  const handleSearch = (event : React.ChangeEvent<HTMLInputElement>) => { // html input type
    // synthetic event: React's wrapper around the browser's native event (prevents native HTML auto reset when submitting): console.log(event);
    setSearchTerm(event.target.value); // sets "stateful value"
  }
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id = 'search'
        value = {searchTerm}
        type = 'text'
        onInputChange = {handleSearch}
        isFocused // same as isFocused = {true}
      >
        <strong>Search: </strong>

      </InputWithLabel>

      <hr /> {/*hr = line break*/}

      <List list = {stories} filterKey={searchTerm}/>

    </div>
  );
}

export default App;

import * as React from 'react';

// api endpoint to fetcch popular tech stories for a certain query
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search'; 

type StoryType =  { // type for storing "stories"
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: string;
};

enum ActionType { // for dispatch actions
  STORIES_FETCH_INIT, // beginning to fetch stories
  STORIES_FETCH_SUCCESS, // success: set stories
  STORIES_FETCH_FAILURE, // failure: error encountered
  REMOVE_STORY,
}

type Action =
  | {type : ActionType.STORIES_FETCH_INIT}
  | {type : ActionType.STORIES_FETCH_SUCCESS; payload : StoryType[]}
  | {type : ActionType.STORIES_FETCH_FAILURE}
  | {type : ActionType.REMOVE_STORY; payload : StoryType}

type State = {// curent state of stories
  data : StoryType[],
  isLoading : boolean,
  isError : boolean,
}


// reducer function: state and action (see https://www.robinwieruch.de/javascript-reducer/)
const storiesReducer = (state : State, action : Action) => {
  switch(action.type) {
    case ActionType.STORIES_FETCH_INIT:
      return {
        ...state,
        isLoading : true,
        isError : false,
      };
    case ActionType.STORIES_FETCH_SUCCESS:
      return {
        ...state,
        isLoading : false,
        isError : false,
        data : action.payload,
      };
    case ActionType.STORIES_FETCH_FAILURE:
      return {
        ...state,
        isLoading : false,
        isError : true, 
      };
    case ActionType.REMOVE_STORY:
      return {
        ...state,
        data : state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default : throw new Error();
  }
}

/*
// simulating async data w/ Promise w/ original stories, replace with API later
const getAsyncStories = () =>
  new Promise<{data : {stories : StoryType[]}}>((resolve, reject) => 
  setTimeout( // simulates data delay for 500ms (0.5s)
    () => resolve({ data : {stories : initialStories}}),
    // reject,
    500
  )
);
*/

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

type SearchProps = {id : string, value : any, type : string, onInputChange : (event : React.ChangeEvent<HTMLInputElement>) => void, isFocused : boolean, children : any}; // value = same type as in "type"
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

type ItemProps = {item : StoryType, deleteItem : (item_to_remove : StoryType) => void, index : number};
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
function Item({item, deleteItem, index} : ItemProps) {
  // console.log("Item component rendered!")
  // console.log(item.objectID);
  return (
    <li key = {item.objectID}>
      <span>
        <a href = {item.url}>{item.title} </a>
      </span>
      <span>{item.author} </span>
      <span>{item.num_comments} </span>
      <span>{item.points} </span>
      <span>{item.objectID}</span>
      <span>{index}</span> {/*index of item in list!*/}
      <input
        type = "button"
        value = "Delete"
        onClick={() => (deleteItem(item))} // or onClick={deleteItem.bind(null, item)}: OK to use inline handlers if they don't obscure crit. implement details, otherwise no
      >
      </input>
    </li>
  );
}

/*
child component of app, leaf component (doesn't render any other components)
component similar idea to 'class' in other
we use components as elements anywhere else, generate instances of List
*/
type ListProps = { list: StoryType[], deleteItem : (item : StoryType) => void};
function List({list, deleteItem} : ListProps) { // props: everything we pass down from parent to child, cannot be modified (const)
  // console.log("List component rendered!")
  return (
  <ul>
    {/*each DIRECT decendant of ul needs key: even component!*/}
    {list.map((item : StoryType , index : number) => (
      <Item key={item.title} item = {item} deleteItem={deleteItem} index = {index} />
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

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer, // "state setter" function
    { data : [] as StoryType[], isLoading : false, isError : false},
  );
  const [searchTerm, setSearchTerm] = useStorageState('search', ''); // custom React hook! see "useStorageState"

  React.useEffect(() => {
    dispatchStories({ type : ActionType.STORIES_FETCH_INIT })
    fetch(`${API_ENDPOINT}`) // fetch stories about react
    .then((result) => result.json()) // translate fetch api into json
    .then((result) => { // resolves properly
      dispatchStories({
        type : ActionType.STORIES_FETCH_SUCCESS,
        payload : result.hits,
      });
    })
    .catch(() => { // error
      dispatchStories({ type : ActionType.STORIES_FETCH_FAILURE })
    });
  }, []); // empty dependency list = sideffect only runs once: when the component renders for the first time

  /*
  [current_state, function to change state], like read n write
  useState is "React Hook": state can be anything from string to complex datastructure
  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem('search') || ''
  ); "stateful value": may change over time. when changed, causes rerender of children up to parent where stateful value is defined
  */

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

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ?
        (<p>Loading...</p>) 
        :
        <List
          list={stories.data.filter((story) => story.title ? story.title.toLowerCase().includes(searchTerm.toLowerCase()) : false)}
        deleteItem={(item : StoryType) => {
          dispatchStories({
            type : ActionType.REMOVE_STORY,
            payload : item,
          });
        }}
        />
      }
    </div>
  );
}

export default App;

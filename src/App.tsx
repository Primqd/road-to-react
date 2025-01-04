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

// npm run dev
// "bridge" that makes "auto-refresh" possible is react Fast Refresh on React's side and Hot Module Replacement on dev server side
// jsx enables combining of markup (HTML) and logic (JS): map allows mapping from js array to html

// function Blah() {return ...} vs const Blah = () => {return ...} or const Blah = () => (...): lambda function
// both are fine to use: just make sure to do either consistently :)
// * although implicit return statemeent might introduce tedious refactorings???

type SearchProps = { searchTerm : string, onSearch : CallbackFunc };
function Search({ searchTerm, onSearch} : SearchProps) {
  // console.log("Search component rendered!")
  // component for the serach bar

  // "props destructuring via object destructing" (works in js too!) const {searchTerm, onSearch} = props;

  const handleBlur = (event : React.FocusEvent<HTMLInputElement>) => {
    console.log(event);
  }

  return(
    <div>
      <label htmlFor="test_input">Search: </label>
      <input type="text" id="test_input" name="test_input" onChange={onSearch} onBlur={handleBlur} value = {searchTerm}>
      </input> {/*remember, pass function to values; not return value of function! value parameter forces sync with react state instead of letting component maintain its own independent state: controlled component*/}

      <p>Searching for <strong>{searchTerm}</strong></p>
    </div>
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

// child component of app, leaf component (doesn't render any other components)
// component similar idea to 'class' in other
// we use components as elements anywhere else, generate instances of List
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
  // console.log("App component rendered!")

  // React component (App Component specifically) is just a js function, CamelCase + staring capital (determined by function starting with Capital)
  // specifically function component, most common although other types
  // function compoent runs every time the component is displayed in the browser: for the initial rendering and any subsequent re-renders

  // htmlFor reflects attribute in vanilla html, due to impementation detauls of React
  // TSX closer to js than html, so uses camelCase

  // points = popularity
  // don't fit standard js naming conventions
  // key attribute used for efficent rerender: when have to rerender, checks whether item has changed; can efficently exchanged changed item w/ key identifier
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
  ];

    // [current_state, function to change state], like read n write
  // useState is "React Hook": state can be anything from string to complex datastructure
  const [searchTerm, setSearchTerm] = React.useState(''); // "stateful value": may change over time. when changed, causes rerender of children up to parent where stateful value is defined

  // callback handler: event handler that allows "communication" between parent and child components (pass as prop to child, lifting state)
  const handleSearch = (event : React.ChangeEvent<HTMLInputElement>) => { // html input type
    // synthetic event: React's wrapper around the browser's native event (prevents native HTML auto reset when submitting): console.log(event);
    setSearchTerm(event.target.value); // sets "stateful value"
  }
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search searchTerm = {searchTerm} onSearch = {handleSearch}/>

      <hr /> {/*hr = line break*/}

      <List list = {stories} filterKey={searchTerm}/>

    </div>
  );
}

export default App;

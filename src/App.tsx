import * as React from 'react';

// npm run dev
// "bridge" that makes "auto-refresh" possible is react Fast Refresh on React's side and Hot Module Replacement on dev server side
// jsx enables combining of markup (HTML) and logic (JS): map allows mapping from js array to html

// points = popularity
// don't fit standard js naming conventions
// key attribute used for efficent rerender: when have to rerender, checks whether item has changed; can efficently exchanged changed item w/ key identifier
const list = [
  {
    title : 'React',
    url : 'https://reactjs.org/',
    author : 'Jordan Walke',
    num_comments : 3,
    points : 4,
    objectID : 0,
  },
  {
    title : 'Redux',
    url : 'https://redus.js.org/',
    author : 'Dan Abramov, Andrew Clark',
    num_comments : 2,
    points : 5,
    objectID : 1,
  },
];

function Search() {
  // component for the serach bar
  return(
    <div>
      <label htmlFor="test_input">Search: </label>
      <input type="text" id="test_input" name="test_input"></input>
    </div>
  );
}

// child component of app, leaf component (doesn't render any other components)
// component similar idea to 'class' in other
// we use components as elements anywhere else, generate instances of List
function List() {
  return (
    <ul>
    {list.map((item, index) => {
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
    })}
  </ul>
  );
}

// entry point or root component; root of component tree
function App() {
  // React component (App Component specifically) is just a js function, CamelCase + staring capital (determined by function starting with Capital)
  // specifically function component, most common although other types
  // function compoent runs every time the component is displayed in the browser: for the initial rendering and any subsequent re-renders

  // htmlFor reflects attribute in vanilla html, due to impementation detauls of React
  // TSX closer to js than html, so uses camelCase

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search />

      <hr /> {/*hr = line break*/}

      <List />
      <List />

    </div>
  );
}

export default App;

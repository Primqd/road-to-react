import * as React from 'react';

type StoryType =  {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: number;
};

// npm run dev
// "bridge" that makes "auto-refresh" possible is react Fast Refresh on React's side and Hot Module Replacement on dev server side
// jsx enables combining of markup (HTML) and logic (JS): map allows mapping from js array to html

// function Blah() {return ...} vs const Blah = () => {return ...} or const Blah = () => (...): lambda function
// both are fine to use: just make sure to do either consistently :)
// * although implicit return statemeent might introduce tedious refactorings???

function Search() {
  // component for the serach bar

  // [current_state, function to change state], like read n write
  // useState is "React Hook": state can be anything from string to complex datastructure
  const [searchTerm, setSearchTerm] = React.useState(''); // "stateful value": may change over time. when changed, causes rerender of children up to parent where stateful value is defined

  const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => { // html input type
    // synthetic event: React's wrapper around the browser's native event (prevents native HTML auto reset when submitting): console.log(event);
    setSearchTerm(event.target.value);
  }

  const handleBlur = (event : React.FocusEvent) => {
    console.log(event);
  }

  return(
    <div>
      <label htmlFor="test_input">Search: </label>
      <input type="text" id="test_input" name="test_input" onChange={handleChange} onBlur={handleBlur}></input> {/*remember, pass function to values; not return value of function!*/}

      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
    </div>
  );
}

function Item(props : {item : StoryType, index : number}) {
  return (
    <li key = {props.item.objectID}>
      <span>
        <a href = {props.item.url}>{props.item.title} </a>
      </span>
      <span>{props.item.author} </span>
      <span>{props.item.num_comments} </span>
      <span>{props.item.points} </span>
      <span>{props.index}</span> {/*index of item in list!*/}
    </li>
  );
}

// child component of app, leaf component (doesn't render any other components)
// component similar idea to 'class' in other
// we use components as elements anywhere else, generate instances of List
function List(props : { list: StoryType[]}) { // props: everything we pass down from parent to child, cannot be modified (const)
  return (
    <ul>
    {props.list.map((item : StoryType , index : number) => (
      <Item item = {item} index = {index} />
      ))}
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

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search />

      <hr /> {/*hr = line break*/}

      <List list = {stories}/>

    </div>
  );
}

export default App;

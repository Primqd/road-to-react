import * as React from 'react';

// "bridge" that makes "auto-refresh" possible is react Fast Refresh on React's side and Hot Module Replacement on dev server side
// jsx enables combining of markup (HTML) and logic (JS)

const welcome = {
  greeting : "Hey",
  title : "React"
};


function getTitle(title : string) {
  return welcome.title.concat(title);
}

function App() {
  // React component (App Component specifically) is just a js function, CamelCase + staring capital (determined by function starting with Capital)
  // specifically function component, most common although other types
  // function compoent runs every time the component is displayed in the browser: for the initial rendering and any subsequent re-renders
  
  // htmlFor reflects attribute in vanilla html, due to impementation detauls of React
  // TSX closer to js than html, so uses camelCase
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  
  const numItems = nums.map((num) => ( // # nums to jsx objects
    <li>
      {num}
    </li>
  ));
  
  return ( // {title} calls VARIABLE title! how TSX differs from pure HTML
    <div>
      <h1>{getTitle(' ')}{welcome.greeting}</h1> 

      <label htmlFor="test_input">Test</label>
      <input type="text" id="test_input" name="test_input"></input>
      <ul>{numItems}</ul>
    </div>
  );
}

export default App

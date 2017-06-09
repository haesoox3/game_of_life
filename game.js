var mainElement = document.getElementById('main')
if (mainElement) {
  var game = Life(mainElement)

  document.getElementById('step_btn')
  .addEventListener('click', game.step);
  document.getElementById('play_btn')
  .addEventListener('click', game.togglePlaying);
  document.getElementById('reset_btn')
  .addEventListener('click', game.random);
  document.getElementById('clear_btn')
  .addEventListener('click', game.clear);
}

function Life(container, width=12, height=12) {
  var present = new Board(width, height);
  var future = new Board(width, height);

  var table = createTable();
  var timer, playing = false; 
  
  container.appendChild(table);

  table.addEventListener('mousedown', toggleCellFromEvent)

  function createTable() {
    var table = document.createElement('table');       // <table
    table.classList.add('board')                       //   class='board'>
    for (var r = 0; r < height; r++) {
      var tr = document.createElement('tr');           //   <tr>
      for (var c = 0; c < width; c++) {                //     For instance, at r=2, c=3:
        var td = document.createElement('td');         //     <td
        td.id = `${r}-${c}`                            //       id="2-3">
        // We'll put the coordinate on the cell
        // Element itself, letting us fetch it
        // in a click listener later.
        td.coord = [r, c];        
        tr.appendChild(td);                            //     </td>
      }
      table.appendChild(tr);                           //   </tr>
    }                                                  //  </table>
    return table;    
  }
  
  function toggleCellFromEvent(event) {
    var cell = document.getElementById(event.target.id); 
    present.toggle(cell.coord);
    paint();
  }

  function paint() {
    //   https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
    //   https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
    var cells = table.getElementsByTagName("td"); 
    for (var i=0; i<cells.length; i++){
      if (present.get(document.getElementById(cells[i].id).coord) === 1){
        cells[i].classList.add("alive");
      }
      else{
        cells[i].classList.remove("alive");
        cells[i].classList.add("dead");
      }
    }
  }

  function step() {
    //   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment\
    [present, future] = tick(present, future); 
    paint();
  }

  function play() {
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
    playing = true;
    timer = setInterval(step, 500);
  }

  function stop() {
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearInterval
    playing = false;
    clearInterval(timer);
  }

  function togglePlaying() {
    if (playing){
      stop();
    } 
    else{
      play();
    }
  }

  function clear() {
    function everythingDies() { return false }
    [present, future] = tick(present, future, everythingDies);
    paint();
  }

  function random() {
    function randomize() {return (Math.floor(Math.random()*2)===1) ? true : false}
    [present, future] = tick(present, future, randomize);
    paint();
  }

  return {play, step, stop, togglePlaying, random, clear}
};
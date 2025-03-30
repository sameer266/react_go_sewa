import React, { useState } from 'react';

const BusLayout = () => {
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(5);
  const [aisleAfterColumn, setAisleAfterColumn] = useState(2); // After column B (index 1)
  const [selectedSeats, setSelectedSeats] = useState({});
  const [layoutName, setLayoutName] = useState('');
  const [savedLayout, setSavedLayout] = useState(null); // State to store saved layout data
  const [backRowSeats] = useState(5); // Number of seats in the back row

  // Toggle seat selection
  const toggleSeat = (id, row, col, isBackRow = false) => {
    setSelectedSeats((prev) => {
      const newSeats = { ...prev };
      if (newSeats[id]) {
        delete newSeats[id];
      } else {
        let label;
        if (isBackRow) {
          // For back row, use letter labeling (A, B, C, etc.)
          label = `${String.fromCharCode(65 + col)}${rows + 1}`;
        } else {
          // For regular rows, use letter + number format (A1, B2, etc.)
          const colLetter = String.fromCharCode(65 + col);
          label = `${colLetter}${row + 1}`;
        }

        newSeats[id] = {
          row,
          col,
          isBackRow,
          label,
        };
      }
      return newSeats;
    });
  };

  // Save the current layout
  const saveLayout = () => {
    if (!layoutName.trim()) {
      alert('Please enter a layout name');
      return;
    }

    // Generate the JSON data array
    const layoutData = generateLayoutData();

    const layout = {
      rows,
      columns,
      aisle_column: aisleAfterColumn,
      layout_data: layoutData, // Add the JSON data array to the layout object
    };

    // Save the layout to state
    setSavedLayout(layout);

    // In a real app, you might save to an API or localStorage
    console.log('Layout saved:', layout);
    alert(`Layout "${layoutName}" saved successfully!`);
  };

  // Generate JSON data array with selected seats as objects and unselected seats as 0
  const generateLayoutData = () => {
    const layoutData = [];

    // Add regular rows
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < columns; c++) {
        const seatId = `${r}-${c}`;
        if (selectedSeats[seatId]) {
          // Add the seat as an object if the seat is selected
          row.push({
            seat: selectedSeats[seatId].label,
            status: "available", // You can set this to `true` or `false` if needed
          });
        } else {
          // Add 0 if the seat is unselected
          row.push(0);
        }
      }
      layoutData.push(row);
    }

    // Add back row as a new row in the layout data
    const backRow = [];
    for (let c = 0; c < backRowSeats; c++) {
      const seatId = `back-${c}`;
      if (selectedSeats[seatId]) {
        // Add the seat as an object if the seat is selected
        backRow.push({
          seat: selectedSeats[seatId].label,
          status: "available", 
        });
      } else {
        // Add 0 if the seat is unselected
        backRow.push(0);
      }
    }
    layoutData.push(backRow);

    return layoutData;
  };

  // Create a matrix based on current rows and columns with aisle
  const generateMatrix = () => {
    const matrix = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < columns; c++) {
        // Add seat object with position data
        row.push({
          row: r,
          col: c,
          id: `${r}-${c}`,
          // Determine if this is an aisle position
          isAisle: aisleAfterColumn > 0 && aisleAfterColumn < columns && c === aisleAfterColumn,
        });
      }
      matrix.push(row);
    }
    return matrix;
  };

  const matrix = generateMatrix();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nepali Bus Seating Layout Creator</h1>

      <div className="mb-6 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Rows:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={rows}
              onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Columns:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={columns}
              onChange={(e) => setColumns(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Aisle after column:</label>
            <input
              type="number"
              min="0"
              max={columns - 1}
              value={aisleAfterColumn}
              onChange={(e) => setAisleAfterColumn(Math.min(columns - 1, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Bus Layout</h2>
        <p className="mb-3 text-sm text-gray-600">Click on seats to select/deselect them for your layout.</p>

        <div className="overflow-auto p-4 bg-gray-50 rounded-lg">
          {/* Column labels */}
          <div className="flex mb-2 ml-8">
            {Array.from({ length: columns + (aisleAfterColumn > 0 ? 1 : 0) }).map((_, colIndex) => {
              // Skip rendering column label for the aisle
              if (aisleAfterColumn > 0 && colIndex === aisleAfterColumn) {
                return <div key={`col-${colIndex}`} className="w-12 text-center"></div>;
              }
              const actualCol = colIndex > aisleAfterColumn ? colIndex - 1 : colIndex;
              return (
                <div key={`col-${colIndex}`} className="w-12 text-center font-semibold text-sm">
                  {String.fromCharCode(65 + actualCol)}
                </div>
              );
            })}
          </div>

          <div className="inline-block border border-gray-300 bg-white p-2 rounded">
            {/* Driver area at the front */}
            <div className="flex items-center mb-4">
              <div className="w-6 text-right mr-2"></div>
              <div className="bg-gray-400 rounded p-2 w-32 text-center text-white font-semibold">
                Driver
              </div>
            </div>

            {/* Regular seats */}
            {matrix.map((row, r) => (
              <div key={r} className="flex items-center mb-2">
                {/* Row label */}
                <div className="w-6 text-right mr-2 font-semibold">
                  {r + 1}
                </div>

                {row.map((seat, c) => {
                  // If this is where the aisle should be, render an empty space
                  if (c === aisleAfterColumn) {
                    return (
                      <div key={`aisle-${r}-${c}`} className="w-8 mx-2">
                        {/* Aisle space */}
                      </div>
                    );
                  }

                  const colLetter = String.fromCharCode(65 + c);
                  const label = `${colLetter}${r + 1}`;

                  return (
                    <button
                      key={seat.id}
                      className={`w-12 h-12 m-1 flex items-center justify-center rounded 
                        ${selectedSeats[seat.id] 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300'}`}
                      onClick={() => toggleSeat(seat.id, r, c)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Horizontal back row */}
            <div className="mt-8 mb-2">
              <div className="text-center font-semibold mb-2">Back Row</div>
              <div className="flex justify-center">
                {Array.from({ length: backRowSeats }).map((_, index) => {
                  const seatId = `back-${index}`;
                  const label = `${String.fromCharCode(65 + index)}${rows + 1}`;
                  return (
                    <button
                      key={seatId}
                      className={`w-12 h-12 m-1 flex items-center justify-center rounded 
                        ${selectedSeats[seatId] 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-green-200 hover:bg-green-300'}`}
                      onClick={() => toggleSeat(seatId, rows, index, true)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Save Layout</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Layout name"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
            className="flex-grow p-2 border rounded"
          />
          <button
            onClick={saveLayout}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Save Layout
          </button>
        </div>
      </div>

      {/* Display Saved JSON Data */}
      {savedLayout && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Saved Layout Data</h2>
          <pre className="text-sm bg-white p-4 rounded overflow-auto">
            {JSON.stringify(savedLayout, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Selected Seats</h2>
        <div className="text-sm">
          {Object.keys(selectedSeats).length > 0 ? (
            <div>
              <p>Total seats selected: {Object.keys(selectedSeats).length}</p>
              <p className="mt-2">Selected seats:</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {Object.values(selectedSeats).map((seat) => (
                  <span
                    key={seat.isBackRow ? `back-${seat.col}` : `${seat.row}-${seat.col}`}
                    className={`${seat.isBackRow ? 'bg-green-500' : 'bg-blue-500'} text-white px-2 py-1 rounded text-xs`}
                  >
                    {seat.label}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p>No seats selected yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusLayout;
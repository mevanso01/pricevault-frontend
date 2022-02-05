import moment from 'moment';

export const getSubtractMatrix = (all, past) => {
  let allData = all.items;
  let pastData = past.items;

  if (!allData || !pastData)
    return { items: [], dataRange: [], xRange: [], loading: false, errors: [] };
  if (allData.length === 0 || pastData.length === 0)
    return { items: [], dataRange: [], xRange: [], loading: false, errors: [] };

  var newData = [];
  var dataArray = [];
  allData.forEach((item, index) => {
    var newItem = {};
    newItem.name = item.name;
    newItem.data = [];
    item.data.forEach(function (currentValue, i, arr) {
      let a = +currentValue || null;
      let b = +(pastData[index]?.data[i]) || null;
      let c = null;
      if (a != null && b != null) {
        c = (a - b).toFixed(2);
        dataArray.push(c);
      }
      newItem.data.push(c);
    });

    newData.push(newItem);
  });

  return {
    items: newData,
    dataRange: [Math.min(...dataArray), Math.max(...dataArray)],
    xRange: all.xRange,
    loading: false,
    errors: []
  }
}

export const convertLookbackToDate = (LB, currentDate, action) => {
  switch (LB) {
    case "1D":
      action(moment(currentDate).subtract(1, "days"));
      break;
    case "1W":
      action(moment(currentDate).subtract(1, "weeks"));
      break;
    case "1M":
      action(moment(currentDate).subtract(1, "months"));
      break;
    case "3M":
      action(moment(currentDate).subtract(3, "months"));
      break;
    case "1Y":
      action(moment(currentDate).subtract(1, "years"));
      break;
  }
}
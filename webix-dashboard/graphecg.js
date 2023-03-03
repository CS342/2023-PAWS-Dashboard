anychart.onDocumentReady(function () {
  
    // add data
    var data = [
      ["2003", 1, 0, 0],
      ["2004", 4, 0, 0],
      ["2005", 6, 0, 0],
      ["2006", 9, 1, 0],
      ["2007", 12, 2, 0],
      ["2008", 13, 5, 1],
      ["2009", 15, 6, 1],
      ["2010", 16, 9, 1],
      ["2011", 16, 10, 4],
      ["2012", 17, 11, 5],
      ["2013", 17, 13, 6],
      ["2014", 17, 14, 7],
      ["2015", 17, 14, 10],
      ["2016", 17, 14, 12],
      ["2017", 19, 16, 12],
      ["2018", 20, 17, 14],
      ["2019", 20, 19, 16],
      ["2020", 20, 20, 17],
      ["2021", 20, 20, 20],
      ["2022", 20, 22, 20]
    ];
    
    // create a data set
    var dataSet = anychart.data.set(data);
  
    // map the data for all series
    var firstSeriesData = dataSet.mapAs({x: 0, value: 1});
    var secondSeriesData = dataSet.mapAs({x: 0, value: 2});
    var thirdSeriesData = dataSet.mapAs({x: 0, value: 3});
  
    // create a line chart
    var chart = anychart.line();
  
    // create the series and name them
    var firstSeries = chart.line(firstSeriesData);
    firstSeries.name("Roger Federer");
    var secondSeries = chart.line(secondSeriesData);
    secondSeries.name("Rafael Nadal");
    var thirdSeries = chart.line(thirdSeriesData);
    thirdSeries.name("Novak Djokovic");
  
    // add a legend
    chart.legend().enabled(true);
    
    // add a title
    chart.title("Big Three's Grand Slam Title Race");
    
    // specify where to display the chart
    chart.container("container");
    
    // draw the resulting chart
    chart.draw();
    
  });
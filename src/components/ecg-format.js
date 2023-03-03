export default function getVoltageData(decoded_data) {
    // convert voltage string to numbers array
    let numbers_data = (decoded_data.component[7].valueSampledData.data + decoded_data.component[8].valueSampledData.data + decoded_data.component[9].valueSampledData.data).split(" ").map(Number)
    let millivolt_data = numbers_data.map(i => i / 1000)
    
    let time_voltage_data = [] // map each sample to a time stamp (time interval: 30 s / number of measurements)
    millivolt_data.forEach(function (sample, index) { 
      time_voltage_data.push({x: index * 30 / decoded_data.component[0].valueQuantity.value, y: sample});
    });
    console.log(time_voltage_data)
    return time_voltage_data
  
  }

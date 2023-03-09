export default function getVoltageData(decoded_data) {

   let start_index = 0
   let components = decoded_data.component
   for (let i = 0; i < components.length; i++) {
      if ("valueSampledData" in components[i]) {
      start_index = i
      break;
      } 
   }
   // convert voltage string to numbers array
   let numbers_data = (
      decoded_data.component[start_index].valueSampledData.data +
      decoded_data.component[start_index + 1].valueSampledData.data +
      decoded_data.component[start_index + 2].valueSampledData.data
   )
      .split(' ')
      .map(Number);
   let millivolt_data = numbers_data.map((i) => i / 1000);
   let time_voltage_data = []; // map each sample to a time stamp (time interval: 30 s / number of measurements)
   millivolt_data.forEach((sample, index) => {
      time_voltage_data.push({
         x: (index * 30) / decoded_data.component[0].valueQuantity.value,
         y: sample,
      });
   });
   return time_voltage_data;
}

export default function getVoltageData(decoded_data) {

   let start_index = 0
   const components = decoded_data.component
   const total_samples = decoded_data.component[0].valueQuantity.value
   for (let i = 0; i < components.length; i += 1) {
      if ("valueSampledData" in components[i]) {
      start_index = i
      break;
      } 
   }
   // convert voltage string to numbers array
   const numbers_data = (
      decoded_data.component[start_index].valueSampledData.data +
      decoded_data.component[start_index + 1].valueSampledData.data +
      decoded_data.component[start_index + 2].valueSampledData.data
   )
      .split(' ')
      .map(Number);
   console.log(decoded_data.component[start_index].valueSampledData.data + decoded_data.component[start_index + 1].valueSampledData.data + decoded_data.component[start_index + 2].valueSampledData.data)
   const millivolt_data = numbers_data.map((i) => i / 1000);
   const time_voltage_data = []; // map each sample to a time stamp (time interval: 30 s / number of measurements)
   millivolt_data.forEach((sample, index) => {
      time_voltage_data.push({
         x: (index * 30) / total_samples,
         y: sample,
      });
   });
   const first = Math.floor(total_samples / 3)
   const second = Math.floor(total_samples * (2 / 3))
   const third = total_samples
   return [time_voltage_data.slice(0, first), time_voltage_data.slice(first + 1, second), time_voltage_data.slice(second + 1, third)];
   // return time_voltage_data;

}

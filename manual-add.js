// Manual method to add שמעון פרס to your Google Sheet
// This creates the data structure you can copy-paste into your sheet

const shimonPeres = {
    name: 'שמעון פרס',
    alternatives: ['פרס', 'שמעון', 'Shimon Peres', 'Peres', 'שמעון פרס'],
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Shimon_Peres_2014.jpg/800px-Shimon_Peres_2014.jpg'
};

console.log('📋 Data to add to your Google Sheet:');
console.log('');
console.log('Name:', shimonPeres.name);
console.log('Photo:', shimonPeres.photo);
console.log('Alternatives:', shimonPeres.alternatives.join(', '));
console.log('');
console.log('📊 Copy this to your Google Sheet:');
console.log('Row format:');
console.log(`"${shimonPeres.name}" | "${shimonPeres.photo}" | "${shimonPeres.alternatives.join(', ')}"`);
console.log('');
console.log('📅 For tomorrow\'s date (10/09/2025), add this row:');
console.log(`10/09/2025 | ${shimonPeres.name} | ${shimonPeres.photo} | ${shimonPeres.alternatives.join(', ')}`);
console.log('');
console.log('🎯 Or use this CSV format:');
console.log(`"10/09/2025","${shimonPeres.name}","${shimonPeres.photo}","${shimonPeres.alternatives.join(', ')}"`);



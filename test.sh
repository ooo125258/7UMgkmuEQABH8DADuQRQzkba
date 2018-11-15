rm ./reservations.json
rm ./restaurants.json
cp json_examples/reservations_example.json ./reservations.json
cp json_examples/restaurants_example.json ./restaurants.json
echo node app.js --allRest
node app.js --allRest
echo node app.js --restInfo "Red Lobster"
node app.js --restInfo "Red Lobster"
echo node app.js --restInfo "ed Lobster"
node app.js --restInfo "ed Lobster"
echo node app.js --restInfo
node app.js --restInfo
echo node app.js --allResv "Red Lobster"
node app.js --allResv "Red Lobster"
echo node app.js --hourResv "Nov 17 2018 16:30:00"
node app.js --hourResv "Nov 17 2018 16:30:00"
echo node app.js --addRest "Some Lobster" "a red lobster"
node app.js --addRest "Some Lobster" "a red lobster"
echo node app.js --addRest "Some Lobster" "a red lobster"
node app.js --addRest "Some Lobster" "a red lobster"
echo node app.js --addResv "Red Lobster" "Nov 17 2018 17:16:00" 5
node app.js --addResv "Red Lobster" "Nov 17 2018 17:16:00" 5
echo node app.js --checkOff "Red Lobster"
node app.js --checkOff "Red Lobster"


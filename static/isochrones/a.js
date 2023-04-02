import fs from 'fs';

function is_in_polygon(point, polygon) {
  let count = 0;
  for (let i = 0; i < polygon.length - 1; i++) {
    if (((polygon[i][0] > point[0] ? 1 : 0) ^ (polygon[i + 1][0] > point[0] ? 1 : 0)) &&
      point[1] > polygon[i][1] - (polygon[i][0] - point[0]) * (polygon[i][1] - polygon[i + 1][1]) / (polygon[i][0] - polygon[i + 1][0])
    ) {
      count++;
    }
  }
  return count % 2 != 0;
}

let people = JSON.parse(fs.readFileSync("outputc.json"));

function convert(file_in, file_out) {
  let places = JSON.parse(fs.readFileSync(file_in));
  console.log(file_in, file_out);

  let a = new Array(30).fill(null).map(() => new Array(20).fill(0));

  for (let y in a) {
    for (let x in a[y]) {
      let lon = 21.1 + 0.01 * x;
      let lat = 48.5 + 0.01 * y;
      for (let i in places) {
        if (is_in_polygon([lon, lat], places[i].poly_15)) {
          a[y][x]++;
        }
      }
    }
  }

  for (let y in a) {
    for (let x in a[y]) {
      //a[y][x] = ((((people[y][x]) / (a[y][x]+1)))**2/ 20000);
      //if (!a[y][x]) a[y][x] = 0;
      if (!a[y][x]) {
        a[y][x] = people[y][x]/20;
      }
    }
  }

  fs.writeFileSync(file_out, JSON.stringify(a));
}

fs.readdirSync('.').forEach((x) => {if (x.match('json$') && !x.match('outputc')) convert(x, `../heatmaps/${x}`)});

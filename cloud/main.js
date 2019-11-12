//Request to create thumbnail
//POST => localhost:4242/parse/functions/createthumbnail
//Body => {
//  "landmarkId":"0PCIQ6YkH5"  
//}
Parse.Cloud.define('createthumbnail', function (req, res) {
  var landmark = Parse.Object.extend("Landmarks");
  var query = new Parse.Query(landmark);
  query.get(req.params.landmarkId)
    .then((l) => {
      // const photo = l.get('photo');
      // console.log(photo)
      res.success(l);
    }, (error) => {
      res.success(error);
    });
});

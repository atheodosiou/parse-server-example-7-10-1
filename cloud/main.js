const sharp = require('sharp');

Parse.Cloud.define('thumbnail', function (req, res) {
  Parse.Cloud.httpRequest({ url: req.params.url }).then(function (response) {
    sharp(response.buffer).resize(250, 250).toBuffer()
      .then(data => {
        const file = Array.from(Buffer.from(data, "binary"));
        const parseFile = new Parse.File("resized", file, response.headers['content-type']);
        parseFile.save().then(saved => {
          const landmark = Parse.Object.extend("Landmarks");
          const query = new Parse.Query(landmark);

          query.get(req.params.landmarkId, { useMasterKey: true })
            .then(querySuccess => {
              querySuccess.set("photo_thumb", saved);
              querySuccess.save()
                .then(saveSuccess => {
                  res.success({ message: "Landmark updated", landmark: saveSuccess })
                })
                .catch(saveFailed => {
                  res.error({ message: "Landmark failed to be updated", error: saveFailed })
                })
            })
            .catch(queryFailed => {
              res.error({ message: "Query failed", error: queryFailed })
            })
        })
          .catch(saveFailed => res.error({ saveFailed: saveFailed }));
      }).catch(sharpError => res.error({ sharpError: sharpError }));
  }).catch(httpError => res.error({ httpError: httpError }))
});

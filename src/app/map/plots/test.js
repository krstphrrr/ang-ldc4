obj={"primaryKey":"2015625200115B1","speciesState":"CA","plotId":null,"plotKey":null,"dbKey":"2015","ecologicalSiteId":"XE","latitudeNad83":"32.8717317","longitudeNad83":"-114.719915","state":"CA","county":"Imperial","dateEstablished":null,"projectName":null,"source":"LMF","locationType":"Field","dateVisited":"2015-08-05","elevation":"200.8632","percentCoveredByEcoSite":"100","dateLoadedInDb":"2020-01-09","geoIndicators":[{"ogcFid":9052,"ahAnnGrassCover":0,"ahForbCover":0,"ahGrassCover":0,"ahNonNoxAnnForbCover":0,"ahNonNoxAnnForbGrassCover":0,"ahNonNoxAnnGrassCover":0,"ahNonNoxCover":17.82178218,"ahNonNoxPerenForbCover":0,"ahNonNoxPerenForbGrassCover":0,"ahNonNoxPerenGrassCover":0,"ahNonNoxShrubCover":13.86138614,"ahNonNoxSubShrubCover":0,"ahNonNoxSucculentCover":0,"ahNonNoxTreeCover":7.92079208,"ahNonSagebrushShrubCover":5.94059406,"ahNoxAnnForbCover":0,"ahNoxAnnForbGrassCover":0,"ahNoxAnnGrassCover":0,"ahNoxCover":0,"ahNoxPerenForbCover":0,"ahNoxPerenForbGrassCover":0,"ahNoxPerenGrassCover":0,"ahNoxShrubCover":0,"ahNoxSubShrubCover":0,"ahNoxSucculentCover":0,"ahNoxTreeCover":0,"ahPerenForbCover":0,"ahPerenGrassCover":0,"ahPerenGrassForbCover":0,"ahPreferredForb":0,"ahPreferredForbCover":null,"ahSagebrushCover":0,"ahSagebrushCoverLive":null,"ahShortPerenGrassCover":0,"ahShrubCover":13.86138614,"ahTallPerenGrassCover":0,"bareSoilCover":36.63366337,"county":"Imperial","dbKey":"2015","dateEstablished":null,"dateLoadedInDb":"2020-01-13 09:08:38.546881-07","dateVisited":"2015-08-06T02:02:00.000Z","elevation":201,"ecolSiteName":null,"ecologicalSiteId":"XE","fhCyanobacteriaCover":null,"fhDepSoilCover":null,"fhDuffCover":0,"fhEmbLitterCover":null,"fhHerbLitterCover":0.99009901,"fhLichenCover":0.99009901,"fhMossCover":0,"fhNonNoxAnnForbCover":0,"fhNonNoxAnnGrassCover":0,"fhNonNoxPerenForbCover":0,"fhNonNoxPerenGrassCover":0,"fhNonNoxShrubCover":10.89108911,"fhNonNoxSubShrubCover":0,"fhNonNoxSucculentCover":0,"fhNonNoxTreeCover":6.93069307,"fhNoxAnnForbCover":0,"fhNoxAnnGrassCover":0,"fhNoxPerenForbCover":0,"fhNoxPerenGrassCover":0,"fhNoxShrubCover":0,"fhNoxSubShrubCover":0,"fhNoxSucculentCover":0,"fhNoxTreeCover":0,"fhRockCover":43.56435644,"fhSagebrushCover":0,"fhTotalLitterCover":0.99009901,"fhVagrLichenCover":null,"fhWaterCover":0,"fhWoodyLitterCover":0,"gapCover101200":0,"gapCover200Plus":80.16666667,"gapCover2550":0.8,"gapCover25Plus":80.96666667,"gapCover51100":0,"globalId":"{925E1BDD-20AB-453D-9FBC-1BA52D89A09D}","hgtForbAvg":157.48,"hgtGrassAvg":null,"hgtHerbaceousAvg":157.48,"hgtNonNoxPerenGrassAvg":null,"hgtNonSagebrushShrubAvg":54.61,"hgtNoxPerenGrassAvg":null,"hgtPerenForbGrassAvg":157.48,"hgtPerenForbAvg":157.48,"hgtPerenGrassAvg":null,"hgtSagebrushAvg":null,"hgtSagebrushLiveAvg":null,"hgtShortPerenGrassAvg":null,"hgtTallPerenGrassAvg":null,"hgtWoodyAvg":48.54222222,"latitudeNad83":32.8717317,"locationType":"Field","longitudeNad83":-114.719915,"numSppNonNoxPlant":21,"numSppNoxPlant":0,"numSppPreferredForb":3,"plotkey":"2015625200115B1","percentCoveredByEcoSite":100,"plotId":null,"plotkey2":null,"primaryKey":"2015625200115B1","projectName":null,"rhAnnualProd":null,"rhBareGround":"NS","rhBioticIntegrity":null,"rhCommentsBi":null,"rhCommentsHf":null,"rhCommentsSs":null,"rhCompaction":"NS","rhDeadDyingPlantParts":"NS","rhFuncSructGroup":null,"rhGullies":"NS","rhHydrologicFunction":null,"rhInvasivePlants":null,"rhLitterAmount":null,"rhLitterMovement":"NS","rhPedestalsTerracettes":"NS","rhPlantCommunityComp":null,"rhReprodCapabilityPeren":"NS","rhRills":"NS","rhSoilSiteStability":null,"rhSoilSurfLossDeg":null,"rhSoilSurfResisErosion":null,"rhWaterFlowPatterns":"NS","rhWindScouredAreas":"NS","recordCount":null,"sagebrushShapeAllColumnCount":null,"sagebrushShapeAllPredominant":null,"sagebrushShapeAllSpreadCount":null,"sagebrushShapeLiveColumnCount":null,"sagebrushShapeLivePredominant":null,"sagebrushShapeLiveSpreadCount":null,"soilStabilityAll":3.55555556,"soilStabilityProtected":4.5,"soilStabilityUnprotected":3.28571429,"sppNox":null,"sppPreferredForb":"ERTR8; ERDE6; SPAM2","sppSagebrush":null,"sppShortPerenGrass":null,"sppTallPerenGrass":null,"state":"CA","totalFoliarCover":17.82178218,"createdDate":"2019-07-15T23:11:45.000Z","createdUser":"ILMOCAIMDBO","lastEditedDate":"2019-08-19T22:14:33.000Z","lastEditedUser":"DBROWNING","wkbGeometry":{"type":"Point","coordinates":[-114.71991499999999,32.8717317]},"public":true,"PrimaryKey":"2015625200115B1"}]}
// console.log(obj)

for(const key in obj){
  const array1 = []
  let temp
  let emptyObj
  let unnestedObj = []
  if(key==='geoIndicators'){
    for(let i in obj[key]){
      temp = obj[key][i]
      // for( const [key, value] of Object.entries(temp)){
      for(let j in temp){ 
        //  unnestedObj.push({key[value]:value})
        
        
        // unnestedObj.push(Object.assign(key,value))
        // emptyObj = temp.map(key => ({[key]:value}))
        // console.log(temp)
      }
      // array1.push(obj[key][i])
    }
    console.log(unnestedObj)
  }


}
public with sharing class EmbedVideoSettingController {

    @AuraEnabled
    public static EmbedVideoSetting getEmbedVideoSettings() {
        EmbedVideoSetting setting = new EmbedVideoSetting();
        try {
            EmbedVideoSetting__c result = EmbedVideoSetting__c.getOrgDefaults();
            System.debug(JSON.serialize(result));
            setting.GOOGLE_API_KEY = result.GOOGLE_API_KEY__c;
        } catch(Exception e) {
            System.debug('An exception has occurred:' + e.getMessage());
            throw e;
        }
        return setting;
    }
    
    @AuraEnabled
    public static Boolean saveEmbedVideoSettings(String apiName, String value) {
        try {
            EmbedVideoSetting__c result = EmbedVideoSetting__c.getOrgDefaults();
            System.debug(JSON.serialize(result));
            
            if (apiName == 'google') {
                result.GOOGLE_API_KEY__c = value;
            }
            
            upsert result;
            return true;
        } catch(Exception e) {
            System.debug('An exception has occurred:' + e.getMessage());
            throw e;
        }
    }
    
    @AuraEnabled
    public static String getYoutubePlaylistInfo(String playlistId, Integer maxResults, String pageToken) {
        String result = '';
        EmbedVideoSetting setting = getEmbedVideoSettings();
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        
        String params = '?key=' + setting.GOOGLE_API_KEY;
        params += '&part=snippet';
        params += '&playlistId=' + playlistId;
        params += '&maxResults=' + maxResults;
        if (String.isNotBlank(pageToken)) {
            params += '&pageToken=' + pageToken;
        }

        request.setEndpoint('https://www.googleapis.com/youtube/v3/playlistItems' + params);
        request.setMethod('GET');
        
        HttpResponse response = http.send(request);

        System.debug(response);
                
        return response.getBody();
    }
    
    public class EmbedVideoSetting {
        @AuraEnabled public String GOOGLE_API_KEY { get; set; }
    }
}
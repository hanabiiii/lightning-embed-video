@isTest
public class EmbedVideoSettingControllerTest {

    @isTest
    public static void testEmbedVideoSettings() {
        String googleApiKey = 'googleApiKey';
        Boolean result = EmbedVideoSettingController.saveEmbedVideoSettings('google', googleApiKey);
        System.assertEquals(true, result);
        
        EmbedVideoSettingController.EmbedVideoSetting settings = EmbedVideoSettingController.getEmbedVideoSettings();
        System.assertEquals(googleApiKey, settings.GOOGLE_API_KEY);
    }
    
    @isTest
    public static void testGetYoutubePlaylist() {
        Test.setMock(HttpCalloutMock.class, new PlaylistHttpCalloutMock());
        String result = EmbedVideoSettingController.getYoutubePlaylistInfo('playlistId', 10, 'pageToken');
        System.assertNotEquals(null, result);
    }
    
    public class PlaylistHttpCalloutMock implements HttpCalloutMock {
        // Implement this interface method
        public HTTPResponse respond(HTTPRequest request) {
            // Create a fake response
            HttpResponse response = new HttpResponse();
            response.setHeader('Content-Type', 'application/json');
            response.setBody('{ "kind": "youtube#playlistListResponse", "etag": etag, "nextPageToken": string, "prevPageToken": string, "pageInfo": { "totalResults": integer, "resultsPerPage": integer }, "items": [ playlist Resource ] }');
            response.setStatusCode(200);
            return response; 
        }
    }
}
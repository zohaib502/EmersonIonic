// CRP FieldserviceMBE_CRP(5.7.1.1) FieldServiceAPI (5.7.1.1) TST1
var mcs_config  = {
  "logLevel": mcs.LOG_LEVEL.INFO,
  "logHTTP": true,
  "mobileBackends": {
    "EMERSON_MBE": {
      "default": true,
     // "baseUrl": "https://emersonmobilecloud-a472144.mobileenv.us2.oraclecloud.com:443",
      //"applicationKey": "64c75b15-bede-4f6c-ac40-351580f64b6a",
      "analytics": {
        "location": true
      },
      "appConfig": {
        "XA_TASK_STATUS": "3",
        "AddressTableName": "Address",
        "FeedbackTableName": "User_Feedback",
        "FeedbackQuesTableName": "MST_Feedback_Questions",
        "LanguageTableName": "MST_Languages",
        "TranslationTableName": "MST_Translation_Key",
        "LanguageMappingTableName": "Language_Key_Mappings",
        "AddressAuditLogTableName": "AddressAuditLog"
      },
      "authorization": {
        "basicAuth": {
          //"backendId": "1af3c2a4-ef15-4c1a-b27c-ee71896d1656",
          //BackId For consolidated build(4.10.39.1)
          // "backendId":"9a010cb0-ed72-4098-ae47-29843246e910",
         // "backendId": "7b7b8529-1184-4de9-8cbb-3c9faffc4e65",
        //  "anonymousToken": "QTQ3MjE0NF9FTUVSU09OTU9CSUxFRkFUX01PQklMRV9BTk9OWU1PVVNfQVBQSUQ6b3FibGZjX3NrMTRWdHA="
        }
      }
    }
  }
};
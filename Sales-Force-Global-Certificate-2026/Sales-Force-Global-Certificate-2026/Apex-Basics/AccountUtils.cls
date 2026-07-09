public class AccountUtils {
    public static List<Account> accountsByState(String state){
        List<Account> accList=[SELECT Id, Name FROM Account WHERE BillingState = :state];
        return accList;
    }
}
 
_________________________________________________________________________________
Challenge 2: Understand Execution Context
 
AccountTriggerHandler:
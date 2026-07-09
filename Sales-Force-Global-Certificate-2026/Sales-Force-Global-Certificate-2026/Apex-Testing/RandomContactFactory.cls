public class RandomContactFactory {
    public static List<Contact> generateRandomContacts(Integer numContactsToGenerate, String FName) {
        List<Contact> contactList = new List<Contact>();
        
    for(Integer i=0;i<numContactsToGenerate;i++) {
            Contact c = new Contact(FirstName=FName + ' ' + i, LastName = 'Contact '+i);
            contactList.add(c);
            System.debug(c);
        }
        //insert contactList;
        System.debug(contactList.size());
        return contactList;
    }
}
--------------------------------------------------------------------------------------------------------------------------------------

Module: Find and Fix Bugs with Apex Replay Debugger
Module: Asynchronous Apex
Challenge2: Use Future Methods
1.1 AccountProcessor
***********************
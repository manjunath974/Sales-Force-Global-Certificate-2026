public class ContactAndLeadSearch {
  
    public static list<list< sObject >> searchContactsAndLeads(String lastName){
     
        list<list< sObject >> ContactLeadList = [ Find : lastName IN ALL FIELDS
                                                 RETURNING contact(name),
                                                 lead (Name) ];
      return ContactLeadList;
  }   
} 
press ctrl +E to create the name ending with Sumith

public class ContactAndLeadSearch {

    public static List<List<SObject>> searchContactsAndLeads(String searchTerm) {
        return [
            FIND :searchTerm
            IN NAME FIELDS
            RETURNING
                Contact(Id, FirstName, LastName),
                Lead(Id, FirstName, LastName)
        ];
    }
}
--------------------------------------------------------------------------------------------------------------------------------------
Module:  Apex Triggers

Challenge 1: Get Started with Apex Triggers
public class TestVerifyDate 
{
    static testMethod void testMethod1() 
    {
        Date d = VerifyDate.CheckDates(System.today(),System.today()+1);
        Date d1 = VerifyDate.CheckDates(System.today(),System.today()+60);
    }
}
Challenge 2: Test Apex Triggers
1.restrictcontactbyname
***********************
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const linkClass = "font-medium text-primary underline underline-offset-4";

export function SanitationDetails() {
  return (
    <Accordion type="multiple" className="mt-4">
      <AccordionItem value="recycling" className="border-border">
        <AccordionTrigger>Recycling & collection day</AccordionTrigger>
        <AccordionContent className="space-y-3 text-muted-foreground">
          <p>For LA Sanitation residential curbside service, put your black trash, blue recycling and green organics bins out on the same weekly collection day. Set them out before 6 a.m. and bring them back by 8 p.m.</p>
          <p>Apartment buildings served by recycLA may have a different schedule. Check with your property manager or collection provider; holiday schedules can also change pickup.</p>
          <a href="https://sanitation.lacity.gov/services/curbside-trash-cans-and-bins-guidelines-repair-and-replacement" target="_blank" rel="noreferrer" className={linkClass}>LA Sanitation bin guidelines</a>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="compost" className="border-border">
        <AccordionTrigger>Food scraps & composting</AccordionTrigger>
        <AccordionContent className="space-y-3 text-muted-foreground">
          <p>Yes—food scraps belong in your green organics bin, along with yard trimmings and food-soiled paper. LA requires residents to separate organic waste; it is not just optional.</p>
          <p>Accepted items include fruit and vegetable scraps, meat, bones, dairy, eggshells, coffee grounds and greasy pizza boxes.</p>
          <p>Empty scraps loose into the bin. Keep plastic bags, “compostable” bags and plastics, and pet waste out. Backyard composting or a community compost drop-off are other options; their accepted materials may differ.</p>
          <a href="https://sanitation.lacity.gov/services/weekly-curbside-green-bin-collection-organics" target="_blank" rel="noreferrer" className={linkClass}>LA Sanitation organics guide</a>
          <p>Missing an organics bin? Ask your property manager or call LA Sanitation at <a href="tel:18007732489" className={linkClass}>1-800-773-2489</a>.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="permits" className="border-border">
        <AccordionTrigger>Street parking permits</AccordionTrigger>
        <AccordionContent className="space-y-3 text-muted-foreground">
          <p>Check the signs on your block for a Preferential Parking District (PPD) or Overnight Parking District number and restricted hours. Permit rules vary by street—not just by neighborhood.</p>
          <ol className="list-decimal space-y-3 pl-5">
            <li><a href="https://ladotparking.org/permits/" target="_blank" rel="noreferrer" className={linkClass}>Check LADOT parking permit programs</a> for annual resident, visitor and guest options, current fees and application links.</li>
            <li><a href="https://ladotparking.org/permits/ppd-permits/" target="_blank" rel="noreferrer" className={linkClass}>Apply for a preferential parking permit</a>. LADOT lists the ID, residency and vehicle documents needed.</li>
          </ol>
          <p>Not sure whether your address qualifies? Contact the Parking Permits Division at <a href="tel:13108435936" className={linkClass}>(310) 843-5936</a> with your address and the district number shown on nearby signs.</p>
          <p>A permit only exempts you from the applicable permit-parking restriction. Street sweeping, red curbs and other parking rules still apply.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
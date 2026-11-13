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
        <AccordionTrigger>Permits & property rules</AccordionTrigger>
        <AccordionContent className="space-y-3 text-muted-foreground">
          <p>Requirements depend on your exact property and proposed work—not just the neighborhood name.</p>
          <ol className="list-decimal space-y-3 pl-5">
            <li><a href="https://zimas.lacity.org/" target="_blank" rel="noreferrer" className={linkClass}>Search your address in ZIMAS</a> for zoning, historic-preservation restrictions, specific plans and other overlays, plus building-permit history.</li>
            <li><a href="https://dbs.lacity.gov/services/plan-review-permitting" target="_blank" rel="noreferrer" className={linkClass}>Check Building & Safety permit requirements</a> for construction, remodeling and repairs. Confirm which permits and clearances your project needs before starting.</li>
            <li><a href="https://planning.lacity.gov/project-review/planning-approvals" target="_blank" rel="noreferrer" className={linkClass}>Check City Planning approvals</a> if zoning or an overlay requires additional review.</li>
          </ol>
          <p>For parking permits, street work or events, the issuing department differs. Call <a href="tel:311" className={linkClass}>3-1-1</a> to find the right office.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
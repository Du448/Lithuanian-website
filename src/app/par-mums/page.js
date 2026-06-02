import Link from "next/link";
import { Layers, Wrench, ShieldCheck, MessageCircle } from "lucide-react";

export const metadata = { title: "Par mums" };

export default function AboutPage() {
  return (
    <main>
      {/* Intro */}
      <section className="border-b border-line">
        <div className="container py-6">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide text-ink">Par mums</h1>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 text-[15px] text-ink">
              <p>
                Mēs piedāvājam kvalitatīvas metāla ārdurvis un iekšdurvis ar piegādi un
                profesionālu montāžu visā Latvijā. Strādājam ar pārbaudītiem un uzticamiem
                ražotājiem, lai nodrošinātu drošību un ilgmūžību.
              </p>
              <p>
                Sortimentā vairāk nekā 400 modeļu dažādu stilu un krāsu izvēlē. Palīdzēsim
                atrast tieši jūsu mājoklim piemērotāko risinājumu — no slēptajām iekšdurvīm
                līdz siltinātām ārdurvīm privātmājām.
              </p>
              <p>
                Aicinām apmeklēt mūsu salonu, kur durvis var apskatīt un salīdzināt klātienē,
                kā arī saņemt speciālista konsultāciju.
              </p>
              <div>
                <Link href="/kontakti" className="inline-block bg-accent hover:bg-accent-dark text-white rounded-sm px-5 py-2">
                  Sazināties
                </Link>
              </div>
            </div>
            {/* Placeholder image block */}
            <div className="rounded-sm border border-line bg-[--color-soft] aspect-16/10" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="container py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-sm border border-line bg-white p-4">
              <div className="mb-2 text-ink inline-flex items-center gap-2">
                <Layers size={18} />
                <span className="font-semibold">Plašs sortiments</span>
              </div>
              <p className="text-[15px] text-muted">Vairāk nekā 400 durvju modeļi dažādām gaumēm un budžetiem.</p>
            </div>
            <div className="rounded-sm border border-line bg-white p-4">
              <div className="mb-2 text-ink inline-flex items-center gap-2">
                <Wrench size={18} />
                <span className="font-semibold">Profesionāla montāža</span>
              </div>
              <p className="text-[15px] text-muted">Sertificēti meistari nodrošina kvalitatīvu uzstādīšanu.</p>
            </div>
            <div className="rounded-sm border border-line bg-white p-4">
              <div className="mb-2 text-ink inline-flex items-center gap-2">
                <ShieldCheck size={18} />
                <span className="font-semibold">Garantija</span>
              </div>
              <p className="text-[15px] text-muted">Ražotāja un montāžas garantija drošam rezultātam.</p>
            </div>
            <div className="rounded-sm border border-line bg-white p-4">
              <div className="mb-2 text-ink inline-flex items-center gap-2">
                <MessageCircle size={18} />
                <span className="font-semibold">Bezmaksas konsultācija</span>
              </div>
              <p className="text-[15px] text-muted">Palīdzēsim izvēlēties optimālu risinājumu jūsu vajadzībām.</p>
            </div>
          </div>
          {/* Second placeholder image row */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-sm border border-line bg-[--color-soft] aspect-4/3" />
            <div className="rounded-sm border border-line bg-[--color-soft] aspect-4/3" />
            <div className="rounded-sm border border-line bg-[--color-soft] aspect-4/3" />
          </div>
        </div>
      </section>
    </main>
  );
}

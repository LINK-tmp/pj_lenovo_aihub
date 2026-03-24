import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { FileText, Search, Handshake, ArrowRight } from "lucide-react";

export default function PublicTopPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - same gradient as authenticated pages */}
      <header className="sticky top-0 z-50 gradient-brand shadow-lg">
        <div className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-base font-bold text-white leading-tight tracking-wide">
                関西AI Hub
              </div>
              <div className="text-[10px] text-white/60 leading-tight tracking-widest uppercase">
                Kansai AI Hub
              </div>
            </div>
          </div>
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20"
            >
              ログイン
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero with background image */}
      <section
        className="relative min-h-[480px] md:min-h-[540px] flex items-center justify-center"
        style={{
          backgroundImage: "url('/before_login_image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6">
          <p className="text-white/50 text-xs tracking-[0.3em] uppercase mb-4">
            Kansai AI Hub
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-wider drop-shadow-lg">
            関西AI Hub
          </h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-6" />
          <p className="text-base md:text-lg text-white/80 mb-10 max-w-xl mx-auto leading-relaxed font-light tracking-wide">
            関西圏の企業課題と技術シーズをつなぐ
            <br />
            情報流通プラットフォーム
          </p>
          <Link href="/login">
            <Button
              size="lg"
              className="bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm px-8 py-3 tracking-wide"
            >
              ログインして始める
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F5F5F8] to-transparent" />
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.2em] text-brand-gray uppercase mb-2 font-heading">
              About
            </p>
            <h2 className="text-2xl md:text-3xl font-light tracking-wide">
              関西AI Hubとは
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="w-7 h-7" />}
              title="課題を登録"
              description="企業がユースケースや課題を登録。PoC予算や技術要件を構造化して蓄積します。"
            />
            <FeatureCard
              icon={<Search className="w-7 h-7" />}
              title="案件を探す"
              description="大学やJAM BASE会員企業が公開された案件を閲覧し、対応可能な案件に応募できます。"
            />
            <FeatureCard
              icon={<Handshake className="w-7 h-7" />}
              title="マッチング"
              description="事務局が情報の受け渡しをサポートし、企業と開発パートナーをつなぎます。"
            />
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.2em] text-brand-gray uppercase mb-2 font-heading">
              Flow
            </p>
            <h2 className="text-2xl md:text-3xl font-light tracking-wide">
              情報の流れ
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-3">
            {[
              "企業が課題投稿",
              "事務局が整理・公開",
              "案件を掲示板で公開",
              "応募・提案",
              "マッチング・進行",
            ].map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="gradient-brand-2 text-white px-5 py-3.5 rounded-xl text-sm font-medium min-w-[150px] text-center shadow-md">
                  {label}
                </div>
                {i < 4 && (
                  <ArrowRight className="w-5 h-5 text-brand-gray/40 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.2em] text-brand-gray uppercase mb-2 font-heading">
              Contact
            </p>
            <h2 className="text-2xl md:text-3xl font-light tracking-wide">
              参加について
            </h2>
          </div>
          <div className="bg-white rounded-2xl p-10 max-w-2xl mx-auto text-center shadow-sm">
            <p className="text-sm text-brand-dark mb-4 leading-relaxed">
              JAM BASE会員企業・大学の方はアカウント発行をお問い合わせください。
              <br />
              企業の方はユースケース登録をご希望の場合、事務局までご連絡ください。
            </p>
            <p className="text-xs text-brand-gray">
              お問い合わせ先: 関西AI Hub 事務局
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-wine/10 text-brand-mid rounded-2xl mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-3 tracking-wide">{title}</h3>
      <p className="text-sm text-brand-gray leading-relaxed">{description}</p>
    </div>
  );
}

"use client";
import React from "react";
import type { Metadata } from "next";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Newspaper,
  BadgePercent,
  Users,
  MapPin,
  MonitorDown,
  CreditCard,
  NotebookText,
  Plus,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import CarStatisticsChart from "@/components/Dashboard/Cars/CarStatisticsChart";
import SimpleChart from "@/components/Dashboard/Cars/SimpleChart";

type Props = {};

function Page({}: Props) {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const isRtl = locale === "ar";

  const statsCards = [
    {
      title: t("stats.cars"),
      value: "156",
      change: "+12%",
      icon: Car,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/cars",
    },
    {
      title: t("stats.news"),
      value: "23",
      change: "+8%",
      icon: Newspaper,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/news",
    },
    {
      title: t("stats.reels"),
      value: "45",
      change: "+15%",
      icon: BadgePercent,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/reels",
    },
    {
      title: t("stats.employees"),
      value: "12",
      change: "+2%",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/employees",
    },
  ];

  const quickActions = [
    {
      title: t("actions.addCar"),
      description: t("actions.addCarDesc"),
      icon: Car,
      href: "/cars/add",
      color: "bg-primary hover:bg-primary/90",
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      title: t("actions.addNews"),
      description: t("actions.addNewsDesc"),
      icon: Newspaper,
      href: "/news/add",
      color: "bg-primary hover:bg-primary/90",
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      title: t("actions.addReel"),
      description: t("actions.addReelDesc"),
      icon: BadgePercent,
      href: "/reels/add",
      color: "bg-primary hover:bg-primary/90",
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      title: t("actions.manageLocations"),
      description: t("actions.manageLocationsDesc"),
      icon: MapPin,
      href: "/location",
      color: "bg-primary hover:bg-primary/90",
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8 p-6"
    >
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-[32px] bg-white p-10 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-48 font-black text-gray-900 tracking-tight leading-none mb-4">
              {t("welcome")}
            </h1>
            <p className="text-gray-500 text-xl max-w-2xl font-medium">
              {t("welcomeDesc")}
            </p>
          </motion.div>
          <div className="mt-8 flex gap-3">
            <div className="h-1.5 w-16 bg-primary rounded-full"></div>
            <div className="h-1.5 w-4 bg-primary/20 rounded-full"></div>
            <div className="h-1.5 w-2 bg-primary/10 rounded-full"></div>
          </div>
        </div>

        {/* Abstract background shape */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-400/5 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={stat.href} className="group block h-full">
                <Card className="h-full border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/20 group-hover:-translate-y-1 overflow-hidden rounded-[24px]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <span className="text-12 font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 italic">
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-14 font-bold text-gray-400 uppercase tracking-wider mb-1">
                        {stat.title}
                      </p>
                      <h4 className="text-32 font-black text-gray-900 group-hover:text-primary transition-colors">
                        {stat.value}
                      </h4>
                    </div>
                  </CardContent>
                  <div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-500"></div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bento Grid: Actions & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Card */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full rounded-[32px] border-gray-100 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-gray-50 bg-gray-50/30 p-8">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-24 font-bold">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex-center text-primary">
                      <BarChart3 size={20} />
                    </div>
                    {t("analytics")}
                  </CardTitle>
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {t("liveData")}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[300px] w-full">
                  <SimpleChart isRtl={isRtl} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions List */}
          <div className="space-y-6">
            <h3 className="text-20 font-bold px-2 border-r-4 border-primary leading-none">
              {t("actionsHub")}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link href={action.href} className="group block">
                    <div className="flex items-center gap-4 p-5 rounded-[24px] bg-white border border-gray-100 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-lg group-hover:scale-[1.02]">
                      <div
                        className={`p-4 rounded-2xl ${action.iconBg} group-hover:bg-primary transition-colors duration-300`}
                      >
                        <action.icon
                          className={`w-6 h-6 ${action.iconColor} group-hover:text-white transition-colors`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-0.5">
                          {action.title}
                        </h4>
                        <p className="text-12 text-gray-400 font-medium line-clamp-1">
                          {action.description}
                        </p>
                      </div>
                      <Plus
                        size={18}
                        className="text-gray-300 group-hover:text-primary transition-colors group-hover:rotate-90 duration-300"
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Promo Card */}
            <div className="rounded-[32px] bg-primary p-6 text-white overflow-hidden relative group">
              <div className="relative z-10">
                <h4 className="font-bold mb-2">💡 {t("tips")}</h4>
                <p className="text-12 text-blue-100 opacity-80 leading-relaxed font-medium">
                  {t("tipsDesc")}
                </p>
              </div>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          </div>
        </div>

        {/* Footer Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: t("footerLinks.drafts"),
              desc: t("footerLinks.draftsDesc"),
              icon: NotebookText,
              href: "/cars/drafts",
              color: "text-orange-500",
              bg: "bg-orange-50",
            },
            {
              title: t("footerLinks.testDrive"),
              desc: t("footerLinks.testDriveDesc"),
              icon: MonitorDown,
              href: "/test-drive",
              color: "text-blue-500",
              bg: "bg-blue-50",
            },
            {
              title: t("footerLinks.financing"),
              desc: t("footerLinks.financingDesc"),
              icon: CreditCard,
              href: "/financing",
              color: "text-violet-500",
              bg: "bg-violet-50",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Link href={item.href} className="group block">
                <Card className="rounded-[28px] border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/20">
                  <CardContent className="p-8 flex items-center gap-6">
                    <div className={`p-5 rounded-2xl ${item.bg}`}>
                      <item.icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <div>
                      <h4 className="text-18 font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-14 text-gray-500 font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default Page;

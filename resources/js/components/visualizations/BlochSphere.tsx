import { motion } from "framer-motion";

export const BlochSphere = () => (
    <div className="relative w-96 h-96 perspective-1000 group">
        <motion.div 
            className="w-full h-full rounded-full border border-slate-700/50 bg-gradient-to-br from-slate-800/20 to-slate-900/20 relative transform-style-3d shadow-[0_0_50px_rgba(34,211,238,0.1)] backdrop-blur-sm"
            animate={{ rotateY: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/20" />
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-500/20" />
            <div className="absolute top-[15%] left-[15%] w-[70%] h-[70%] border border-purple-500/10 rounded-full" />
            
            {/* The State Vector */}
            <motion.div 
                className="absolute top-1/2 left-1/2 w-[2px] h-[48%] bg-gradient-to-t from-transparent to-purple-400 origin-bottom transform-style-3d"
                initial={{ rotateX: 0, rotateZ: 0 }}
                animate={{ rotateX: [0, 60, 20, 90, 0], rotateZ: [0, 180, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_#a855f7]" />
            </motion.div>
            
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-mono text-sm">|0⟩</div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white font-mono text-sm">|1⟩</div>
        </motion.div>
    </div>
);